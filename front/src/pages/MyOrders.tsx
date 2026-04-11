//import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { TOrder } from "../types/types";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../api/api";

const MyOrders = () => {
    const [orders, setOrders] = useState<TOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                setLoading(true);
                // const token = localStorage.getItem("token");
                //  axios.defaults.headers.common["x-auth-token"] = token;

                const response = await api.get("/orders/my-orders");
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white !mb-7">
                    My Orders
                </h1>

                {loading ? (
                    <div className="text-center">
                        <Spinner color="purple" aria-label="Loading orders" />
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                ) : (!orders || !Array.isArray(orders) || orders.length === 0) ? (
                    <div className="text-center pt-[75px] pb-[60px]">
                        <p className="text-gray-600 dark:text-gray-400 text-2xl mb-16">
                            You haven't placed any orders yet.
                        </p>
                        <Button color="blue" className=" w-[45%] m-auto dark:!bg-slate-800 dark:text-slate-200 dark:!border-white" href="/">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="pageCardsDiv">
                        {orders.map((order) => (
                            <Card key={order._id} className="w-[370] max-h-[370px]">
                                <div className="flex justify-center items-center gap-5 mb-0 p-0">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Order #{order.orderNumber}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            total price: ${order.totalPrice.toFixed(2)}
                                        </p>
                                        <p className="text-lg text-gray-600 dark:text-gray-400">
                                            total items: {order.totalItems}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 py-2 space-y-3 overflow-y-auto">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        Products:
                                    </h4>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
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

