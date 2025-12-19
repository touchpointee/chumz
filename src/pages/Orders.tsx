import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";
import { getCustomerOrders } from "@/lib/shopify";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Loader2, Package, Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
    const { accessToken, user } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await getCustomerOrders(accessToken);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [accessToken, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.firstName}. Here are your recent orders.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                            You haven't placed any orders yet.
                        </p>
                        <a href="/shop" className="text-primary hover:underline">
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} onClick={() => navigate(`/orders/${encodeURIComponent(order.id)}`)} className="cursor-pointer block">
                                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-muted/30 pb-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                                                    <Badge variant={order.financialStatus === "PAID" ? "default" : "secondary"}>
                                                        {order.financialStatus}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {order.fulfillmentStatus === 'UNFULFILLED' ? 'Order Placed' : order.fulfillmentStatus === 'FULFILLED' ? 'Order Confirmed' : order.fulfillmentStatus}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(order.processedAt), "PPP")}
                                                    </span>
                                                </div>
                                                {order.successfulFulfillments && order.successfulFulfillments.length > 0 && (
                                                    <div className="pt-2 space-y-2">
                                                        {order.successfulFulfillments.map((fulfillment: any, fid: number) => (
                                                            <div key={fid} className="text-sm bg-accent/20 p-2 rounded border border-accent/40">
                                                                <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                                                    {fulfillment.trackingCompany || "Shipment"} Tracking
                                                                </p>
                                                                <div className="flex flex-wrap gap-3 items-center">
                                                                    {fulfillment.trackingInfo.map((track: any, tid: number) => (
                                                                        <div key={tid} className="flex items-center gap-2">
                                                                            <span className="font-mono text-xs bg-background px-2 py-1 rounded border">
                                                                                {track.number}
                                                                            </span>
                                                                            {track.url && (
                                                                                <a
                                                                                    href={track.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                                                                >
                                                                                    Track Package <ArrowUpRight className="h-3 w-3" />
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">
                                                    {order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="grid md:grid-cols-3 gap-8">
                                            <div className="md:col-span-2 space-y-4">
                                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Items</h4>
                                                <div className="space-y-4">
                                                    {order.lineItems.edges.map(({ node: item }: any, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-4">
                                                            <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                                                {item.variant?.image && (
                                                                    <img
                                                                        src={item.variant.image.url}
                                                                        alt={item.variant.image.altText || item.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{item.title}</p>
                                                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-4">Shipping</h4>
                                                {order.shippingAddress ? (
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                        <div>
                                                            <p>{order.shippingAddress.address1}</p>
                                                            <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                                                            <p>{order.shippingAddress.country}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">No shipping address</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Orders;
