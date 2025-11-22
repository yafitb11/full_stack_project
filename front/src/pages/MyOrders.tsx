import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { TOrder } from "../types/types";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const MyOrders = () => {
    const [orders, setOrders] = useState<TOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                axios.defaults.headers.common["x-auth-token"] = token;

                const response = await axios.get("http://localhost:8182/orders/my-orders");
                setOrders(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to fetch orders", { autoClose: 2000 });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };


    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please Login to view your orders
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be logged in to view your orders.
                    </p>
                    <Link to="/signin">
                        <Button color="blue">Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    My Orders
                </h1>

                {loading ? (
                    <div className="text-center">
                        <Spinner color="purple" aria-label="Loading orders" />
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                ) : (!orders || !Array.isArray(orders) || orders.length === 0) ? (
                    <div className="text-center w-[60%] py-[75px] m-auto">
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-16">
                            You haven't placed any orders yet.
                        </p>
                        <Button color="blue" href="/">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order._id} className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Order #{order.orderNumber}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                            total items: {order.totalItems}
                                        </p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                            total price: ${order.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        Products:
                                    </h4>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <img
                                                src={item.product.image.url}
                                                alt={item.product.image.alt}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900 dark:text-white">
                                                    {item.product.title}
                                                </h5>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    ${item.product.price} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

