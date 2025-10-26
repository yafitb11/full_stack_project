import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TProduct } from "../types/types";
import { Button, Card, Spinner } from "flowbite-react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/addToCart";

const ProductDetails = () => {
    const [product, setProduct] = useState<TProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8182/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Product not found", { autoClose: 2000 });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const likeOrUnlikeProduct = async () => {
        if (!user) {
            toast.error("Please login to like products", { autoClose: 2000 });
            return;
        }

        try {
            axios.defaults.headers.common["x-auth-token"] = token;
            await axios.patch(`http://localhost:8182/products/${id}`);

            if (product) {
                const isLiked = product.likes.includes(user._id);

                if (isLiked) {
                    product.likes = product.likes.filter((like) => like !== user._id);
                    toast.success("Product unliked successfully", { autoClose: 2000 });
                } else {
                    product.likes = [...product.likes, user._id];
                    toast.success("Product liked successfully", { autoClose: 2000 });
                }

                setProduct({ ...product });
            }
        } catch (error) {
            console.log("Error liking/unliking product:", error);
            toast.error("Something went wrong", { autoClose: 2000 });
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <Spinner color="purple" aria-label="Loading product details" />
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Product not found
                    </h1>
                    <Link to="/">
                        <Button color="blue">Back to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isLiked = user ? product.likes.includes(user._id) : false;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="aspect-w-16 aspect-h-9">
                        <img
                            src={product.image.url}
                            alt={product.image.alt}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                ${product.price}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {product.likes.length} likes
                            </span>
                            <span className="text-sm text-gray-500">
                                Category: {product.category}
                            </span>
                        </div>

                        <div className="flex space-x-4">
                            {user && !user.isAdmin && (
                                <Button
                                    color={isLiked ? "failure" : "gray"}
                                    onClick={likeOrUnlikeProduct}
                                    className="flex items-center space-x-2"
                                >
                                    <FaHeart className={isLiked ? "text-white" : "text-gray-500"} />
                                    <span>{isLiked ? "Unlike" : "Like"}</span>
                                </Button>
                            )}

                            {user && !user.isAdmin && (
                                <Button
                                    color="blue"
                                    onClick={handleAddToCart}
                                    className="flex items-center space-x-2"
                                >
                                    <FaShoppingCart />
                                    <span>Add to Cart</span>
                                </Button>
                            )}
                        </div>

                        {!user && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800">
                                    Please <Link to="/signin" className="text-blue-600 hover:underline">login</Link> to like products and add them to your cart.
                                </p>
                            </div>
                        )}

                        {user && user.isAdmin && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800">
                                    As an admin, you cannot like products or add them to cart.
                                </p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-4">
                                <Link to="/">
                                    <Button color="gray" outline>
                                        ← Back to Products
                                    </Button>
                                </Link>
                                {user && user.isAdmin && (
                                    <Link to={`/edit-product/${product._id}`}>
                                        <Button color="blue">
                                            Edit Product
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
