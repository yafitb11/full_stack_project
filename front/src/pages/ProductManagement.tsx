import { useState, useEffect } from 'react';
import { FaBoxOpen, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';
import useAuth from "../hooks/useAuth";
import { TOrder, TProduct } from "../types/types";

const ProductManagement = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [orders, setOrders] = useState<TOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8182/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8182/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const calculateOrderCount = (productId: string) => {
        let count = 0;
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    if (item.product._id === productId) {
                        count += item.quantity || 1;
                    }
                });
            }
        });
        return count;
    };

    const productStats = products.map(product => ({
        ...product,
        orderCount: calculateOrderCount(product._id)
    }));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-600" size={48} />
                <span className="mr-3 text-xl">loading...</span>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    You must be the Admin to watch this Page!
                </h1>
            </div>
        );
    }


    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1>products management</h1>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[75%] m-auto">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">product</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <FaShoppingCart size={18} />
                                    Number of items orderd
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <FaHeart size={18} />
                                    Likes
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-center gap-2">
                                    <FaBoxOpen size={18} />
                                    Quantity
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {productStats.length === 0 ? (
                            <tr>
                                <td className="px-6 py-8 text-center text-gray-500">
                                    No Products to show
                                </td>
                            </tr>
                        ) : (
                            productStats.map((product, index) => (
                                <tr
                                    key={product._id}
                                    className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image.url || 'https://via.placeholder.com/60'}
                                                alt={product.title}
                                                className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-800">{product.title || 'no-name'}</div>
                                                <div className="text-sm text-gray-500">ID: {product._id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold text-lg">
                                            {product.orderCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-pink-800 rounded-full font-bold text-lg">
                                            {product.likes.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${product.quantityInStock < 10
                                            ? 'bg-red-100 text-red-800'
                                            : product.quantityInStock < 30
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {product.quantityInStock || 0}
                                        </span>
                                        <span className={product.quantityInStock === 0 ? "text-xl font-bold text-red-600" : ""}>
                                            {product.quantityInStock === 0 ? "!" : ""}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-[75%] mt-7 m-auto">
                <h3 className="font-semibold text-blue-900 mb-2">Color Key for Quantity</h3>
                <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                        <span>30+ units</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                        <span>10-29 units</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                        <span>less than 10</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;