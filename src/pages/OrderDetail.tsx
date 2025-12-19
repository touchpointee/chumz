import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getOrder } from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";
import { Loader2, ArrowLeft, Calendar, Package, MapPin, CreditCard, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAuthStore();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
            return;
        }

        const fetchOrder = async () => {
            try {
                if (!id) return;
                // The ID in URL might be URL-encoded, usually it's passed directly.
                // If the ID is "gid://shopify/Order/123", it needs proper handling in URL.
                // We expect the URL parameter to be the full ID, or base64 encoded.
                // decodeURIComponent is automatic in useParams usually, but let's be safe.
                const orderId = decodeURIComponent(id);
                const data = await getOrder(orderId);
                if (!data) {
                    console.error("Order not found");
                }
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, accessToken, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container py-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                    <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
                </main>
                <Footer />
            </div>
        );
    }

    const currency = order.totalPrice.currencyCode;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container py-8 max-w-4xl">
                <Button variant="ghost" onClick={() => navigate("/orders")} className="mb-6 pl-0 hover:pl-0 hover:bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            Order #{order.orderNumber}
                            <Badge variant={order.financialStatus === "PAID" ? "default" : "secondary"}>
                                {order.financialStatus}
                            </Badge>
                            <Badge variant="outline">
                                {order.fulfillmentStatus === 'UNFULFILLED' ? 'Order Placed' : order.fulfillmentStatus === 'FULFILLED' ? 'Order Confirmed' : order.fulfillmentStatus}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Placed on {format(new Date(order.processedAt), "PPP 'at' p")}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {order.lineItems.edges.map(({ node: item }: any, idx: number) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0 border">
                                            {item.variant?.image ? (
                                                <img
                                                    src={item.variant.image.url}
                                                    alt={item.variant.image.altText || item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-accent/50">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link to={`/product/${item.variant?.product?.handle}`} className="font-medium hover:underline">
                                                    {item.title}
                                                </Link>
                                                <span className="font-semibold">
                                                    {item.originalTotalPrice.currencyCode} {parseFloat(item.originalTotalPrice.amount).toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Price: {item.variant?.price?.amount} x {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment & Tracking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Tracking Info Reuse */}
                                    {order.successfulFulfillments && order.successfulFulfillments.length > 0 ? (
                                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <Package className="h-4 w-4 text-primary" /> Tracking Information
                                            </h4>
                                            {order.successfulFulfillments.map((fulfillment: any, fid: number) => (
                                                <div key={fid} className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">
                                                        Shipped via {fulfillment.trackingCompany || "Carrier"}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {fulfillment.trackingInfo.map((track: any, tid: number) => (
                                                            <div key={tid} className="flex items-center gap-3">
                                                                <span className="font-mono bg-background px-3 py-1 rounded border text-sm">
                                                                    {track.number}
                                                                </span>
                                                                {track.url && (
                                                                    <a
                                                                        href={track.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
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
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Package className="h-4 w-4" />
                                            <span>Tracking information will be available once the order is shipped.</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{currency} {parseFloat(order.subtotalPrice.amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{currency} {parseFloat(order.totalShippingPrice.amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{currency} {parseFloat(order.totalTax.amount).toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{currency} {parseFloat(order.totalPrice.amount).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.shippingAddress && (
                                    <div>
                                        <h4 className="font-medium flex items-center gap-2 mb-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" /> Shipping Address
                                        </h4>
                                        <div className="text-sm text-muted-foreground ml-6">
                                            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                            <p>{order.shippingAddress.address1}</p>
                                            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                                            <p>{order.shippingAddress.country}</p>
                                            {order.shippingAddress.phone && <p className="mt-1">{order.shippingAddress.phone}</p>}
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2 text-sm">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" /> Billing Status
                                    </h4>
                                    <div className="ml-6">
                                        <Badge variant={order.financialStatus === "PAID" ? "default" : "secondary"}>
                                            {order.financialStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetail;
