import { useEffect, useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Droplets, Info, Edit2, Trash2, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getCycleData, saveCycleData, subscribeToPush } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CycleEntry {
    startDate: string;
    endDate: string;
}

export function PeriodTracker() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cycles, setCycles] = useState<CycleEntry[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    // Editing State
    const [editingCycle, setEditingCycle] = useState<{ index: number, originalDate: Date, newDate: Date } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [user?.id]);

    const loadData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const data = await getCycleData(user.id);
            if (data.cycleData && Array.isArray(data.cycleData)) {
                setCycles(data.cycleData);
            }
        } catch (error) {
            console.error("Failed to load cycle data", error);
            toast.error("Could not load your cycle history");
        } finally {
            setLoading(false);
        }
    };

    // Helper: Reconstruct cycles from a list of start dates
    const calculateContinuousCycles = (startDates: Date[]): CycleEntry[] => {
        // Remove duplicates and sort descending (newest first)
        const uniqueDates = Array.from(new Set(startDates.map(d => d.toISOString())))
            .map(d => new Date(d))
            .sort((a, b) => b.getTime() - a.getTime());

        return uniqueDates.map((date, index) => {
            const isLatest = index === 0;
            let endDate: Date;
            if (isLatest) {
                // Default length for the latest cycle
                endDate = addDays(date, 28);
            } else {
                // End date is one day before the start of the next newer cycle (which is at index - 1 in descending list)
                const newerCycleStart = uniqueDates[index - 1];
                endDate = subDays(newerCycleStart, 1);
            }
            return {
                startDate: date.toISOString(),
                endDate: endDate.toISOString()
            };
        });
    };

    const saveCyclesToBackend = async (newCycles: CycleEntry[]) => {
        if (!user?.id) return;

        // Calculate next prediction
        const latestStart = new Date(newCycles[0].startDate);
        const nextDate = addDays(latestStart, 28);
        const nextDateString = format(nextDate, 'yyyy-MM-dd');

        // Calculate Notification Date (Start + 22 Days = On 23rd Day)
        const notificationDate = addDays(latestStart, 22);
        const notificationDateString = format(notificationDate, 'yyyy-MM-dd');

        await saveCycleData(user.id, newCycles, nextDateString, notificationDateString);
        setCycles(newCycles);
    };

    // Check for in-app notification on load/updates
    useEffect(() => {
        if (cycles.length > 0) {
            const latestStart = new Date(cycles[0].startDate);
            // On the 23rd day of the cycle (Start + 22 days)
            const notificationDate = addDays(latestStart, 22);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            console.log("Debug Notification:", {
                latestStart: format(latestStart, 'yyyy-MM-dd'),
                notificationDate: format(notificationDate, 'yyyy-MM-dd'),
                today: format(today, 'yyyy-MM-dd'),
                match: isSameDay(today, notificationDate)
            });

            // Check if today is the notification date (ignoring time)
            if (isSameDay(today, notificationDate)) {
                toast.info("Cycle Alert: Period predicted in 5 days!", {
                    description: "Time to stock up on our comfortable panties.",
                    action: {
                        label: "Shop Now",
                        onClick: () => navigate("/shop") // Assuming /shop exists
                    },
                    duration: 10000,
                });
            }
        }
    }, [cycles, navigate]);

    const handleSave = async () => {
        if (!user?.id || !selectedDate) return;

        setLoading(true);
        try {
            const currentStartDates = cycles.map(c => new Date(c.startDate));
            const newCycles = calculateContinuousCycles([...currentStartDates, selectedDate]);
            await saveCyclesToBackend(newCycles);

            setSelectedDate(undefined);
            toast.success("Cycle history updated!");
        } catch (error) {
            console.error("Failed to save cycle", error);
            toast.error("Failed to save cycle data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCycle = async () => {
        if (!user?.id || !editingCycle) return;

        setLoading(true);
        try {
            // Filter out the OLD date, add the NEW date
            const otherDates = cycles
                .map(c => new Date(c.startDate))
                .filter(d => d.toISOString() !== editingCycle.originalDate.toISOString());

            const newCycles = calculateContinuousCycles([...otherDates, editingCycle.newDate]);
            await saveCyclesToBackend(newCycles);

            setIsDialogOpen(false);
            setEditingCycle(null);
            toast.success("Cycle history updated.");
        } catch (error) {
            console.error("Failed to update cycle", error);
            toast.error("Failed to update cycle");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCycle = async () => {
        if (!user?.id || !editingCycle) return;

        if (!confirm("Are you sure you want to delete this cycle log?")) return;

        setLoading(true);
        try {
            // Filter out the OLD date
            const otherDates = cycles
                .map(c => new Date(c.startDate))
                .filter(d => d.toISOString() !== editingCycle.originalDate.toISOString());

            const newCycles = calculateContinuousCycles(otherDates);
            await saveCyclesToBackend(newCycles);

            setIsDialogOpen(false);
            setEditingCycle(null);
            toast.success("Cycle deleted.");
        } catch (error) {
            console.error("Failed to delete cycle", error);
            toast.error("Failed to delete cycle");
        } finally {
            setLoading(false);
        }
    };

    const openEditDialog = (cycle: CycleEntry, index: number) => {
        const date = new Date(cycle.startDate);
        setEditingCycle({ index, originalDate: date, newDate: date });
        setIsDialogOpen(true);
    };

    const handleEnablePush = async () => {
        if (!user?.id) return;
        try {
            toast.promise(subscribeToPush(user.id), {
                loading: 'Enabling notifications...',
                success: 'Notifications enabled for this device!',
                error: 'Failed to enable notifications. Please Try again.'
            });
        } catch (error) {
            console.error("Push Error", error);
            // toast.error is handled by the promise catch mostly if passed, but here we do it manually or via sonner's default error style
        }
    };

    // Convert cycle entries to modifiers for the calendar
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const periodSplit = cycles.reduce((acc, cycle) => {
        const start = new Date(cycle.startDate);
        const end = new Date(cycle.endDate);
        let current = start;
        while (current <= end) {
            const d = new Date(current);
            // Check if date is in the past or today (Up to "Current Date")
            if (d <= today) {
                acc.past.push(d);
            } else {
                acc.future.push(d);
            }
            current = addDays(current, 1);
        }
        return acc;
    }, { past: [] as Date[], future: [] as Date[] });

    const periodStartDays = cycles.map(cycle => new Date(cycle.startDate));

    const nextPeriodPrediction = () => {
        if (cycles.length === 0) return null;
        // Simple prediction: Last cycle start + 28 days
        // We need to find the latest start date
        const starts = cycles.map(c => new Date(c.startDate)).sort((a, b) => b.getTime() - a.getTime());
        return addDays(starts[0], 28);
    };

    const predictedDate = nextPeriodPrediction();

    if (!user) {
        return (
            <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-white border-brand-coral/20">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-pink/20 rounded-full flex items-center justify-center mb-4">
                        <Droplets className="w-10 h-10 text-brand-coral" />
                    </div>
                    <h2 className="text-3xl font-bold font-poppins text-foreground">
                        Track Your Cycle
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md font-nunito">
                        Log in to access our premium period tracker. Monitor your cycle, predict your next period, and understand your body better.
                    </p>
                    <Button
                        size="lg"
                        className="mt-6 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-full px-8"
                        onClick={() => navigate("/login")}
                    >
                        Login to Track
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-5xl mx-auto overflow-hidden shadow-xl border-border/40">
            <CardHeader className="bg-gradient-to-r from-brand-pink/10 via-white to-brand-blue/10 border-b border-border/10 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold font-poppins flex items-center gap-3">
                            <CalendarIcon className="w-8 h-8 text-brand-coral" />
                            Periods Tracker
                        </CardTitle>
                        <CardDescription className="text-base font-nunito flex items-center gap-2">
                            Log the <strong>start date</strong> of your period. We'll handle the rest.
                        </CardDescription>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden md:flex gap-2 border-brand-coral/20 text-brand-coral hover:bg-brand-pink/10 hover:text-brand-coral"
                            onClick={handleEnablePush}
                        >
                            <Bell className="w-4 h-4" />
                            Get Notifications
                        </Button>

                        {predictedDate && (
                            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-border/20 shadow-sm">
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Next Period on</p>
                                    <p className="text-lg font-bold text-brand-coral">
                                        {format(predictedDate, "MMM d, yyyy")}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-brand-coral/10 flex items-center justify-center">
                                    <Droplets className="w-5 h-5 text-brand-coral" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="md:hidden mt-4 space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-brand-coral/20 text-brand-coral"
                        onClick={handleEnablePush}
                    >
                        <Bell className="w-4 h-4" />
                        Enable Notifications
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border-none"
                            modifiers={{
                                periodPast: periodSplit.past,
                                periodFuture: periodSplit.future,
                                periodStart: periodStartDays,
                                today: [today],
                            }}
                            modifiersStyles={{
                                periodPast: {
                                    backgroundColor: "transparent",
                                    color: "hsl(var(--brand-coral))",
                                    fontWeight: "bold",
                                    borderRadius: "0",
                                },
                                periodFuture: {
                                    backgroundColor: "transparent",
                                    color: "hsl(var(--muted-foreground))", // Gray for future
                                    textDecoration: "dotted underline",
                                    borderRadius: "0",
                                },
                                periodStart: {
                                    backgroundColor: "hsl(var(--brand-coral))",
                                    color: "white",
                                    fontWeight: "bold",
                                    borderRadius: "100%",
                                },
                                today: {
                                    backgroundColor: "transparent",
                                    border: "2px solid hsl(var(--primary))",
                                    fontWeight: "bold",
                                    borderRadius: "100%",
                                    color: "hsl(var(--primary))"
                                }
                            }}
                        />
                    </div >

                    <div className="flex-1 space-y-6">
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                How to use
                                <HoverCard>
                                    <HoverCardTrigger><Info className="w-4 h-4 text-muted-foreground cursor-help" /></HoverCardTrigger>
                                    <HoverCardContent>
                                        Select the start day of your period on the calendar.
                                    </HoverCardContent>
                                </HoverCard>
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground font-nunito">
                                <li>Select the <strong>Start Date</strong> of your period.</li>
                                <li>We automatically calculate your cycle length.</li>
                                <li>Notifications are set based on your latest start date.</li>
                            </ul>
                        </div>

                        {selectedDate && (
                            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-4">
                                <p className="text-sm text-muted-foreground mb-1">Selected Start Date:</p>
                                <p className="font-bold text-lg mb-4">
                                    {format(selectedDate, "MMM d, yyyy")}
                                </p>
                                <Button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white"
                                >
                                    {loading ? "Saving..." : "Log Start Date"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div >

                <div className="border-l border-border/40 pl-8 space-y-6">
                    <h3 className="font-bold text-xl font-poppins">Cycle History</h3>
                    <p className="text-xs text-muted-foreground -mt-4">Click to edit or delete.</p>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {cycles.length === 0 ? (
                            <p className="text-muted-foreground text-sm italic">No logs yet.</p>
                        ) : (
                            cycles.map((cycle, i) => (
                                <button
                                    key={i}
                                    onClick={() => openEditDialog(cycle, i)}
                                    className="w-full text-left p-4 rounded-lg bg-secondary/20 border border-border/30 hover:bg-secondary/30 transition-colors group"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-semibold text-primary">Started</span>
                                        <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-lg font-bold text-foreground">
                                        {format(new Date(cycle.startDate), "MMM d, yyyy")}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Cycle End: {format(new Date(cycle.endDate), "MMM d")}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Cycle</DialogTitle>
                            <DialogDescription>
                                Change the start date or click delete to remove this log.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center py-4">
                            <Calendar
                                mode="single"
                                selected={editingCycle?.newDate}
                                onSelect={(date) => date && setEditingCycle(prev => prev ? ({ ...prev, newDate: date }) : null)}
                                className="rounded-md border"
                            />
                        </div>
                        <DialogFooter className="sm:justify-between">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteCycle}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="button" onClick={handleUpdateCycle} disabled={loading} className="bg-brand-coral hover:bg-brand-coral/90 text-white">
                                    {loading ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent >
        </Card >
    );
}
