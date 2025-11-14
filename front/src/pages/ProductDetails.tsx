import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TProduct } from "../types/types";
import { Button, Spinner } from "flowbite-react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/useAddToCart";
import useLikeProduct from "../hooks/useLikeProduct";
import deleteProduct from "../hooks/useDeleteProduct";

const ProductDetails = () => {
    const [product, setProduct] = useState<TProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const { data: productData } = await axios.get(`http://localhost:8182/products/${id}`);
                setProduct(productData);
                setCategoryName(productData.category_id?.title || "Unknown");
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

    const { toggleLike } = useLikeProduct();
    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like products", { autoClose: 2000 });
            return;
        }
        if (product) {
            const isLiked = product.likes.includes(user._id);
            const newLikedState = await toggleLike(product._id, isLiked);

            if (newLikedState !== null) {
                setProduct({
                    ...product,
                    likes: newLikedState
                        ? [...product.likes, user._id]
                        : product.likes.filter((id) => id !== user._id),
                })
            };
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const nav = useNavigate();
    const handleDeleteProduct = async (productId: string) => {
        deleteProduct(productId);
        nav(-1);
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
                    <div className="aspect-w-16 aspect-h-9">
                        <img
                            src={product.image.url}
                            alt={product.image.alt}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {product.title}
                            </h1>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.subtitle}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                ${product.price}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                                {product.description}
                            </p>
                            {user && user.isAdmin && (
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                                    quantity in stock: {product.quantityInStock}
                                </p>
                            )}
                            {product.isDiscount && (
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                    product is in discount! ${product.discountedPrice}
                                </p>
                            )}
                            {user && user.isAdmin && (
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                                    created at: {product.createdAt}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {product.likes.length} likes
                            </span>
                            <span className="text-sm text-gray-500">
                                Category: {categoryName}
                            </span>
                        </div>

                        <div className="flex space-x-4">
                            {user && !user.isAdmin && (
                                <Button
                                    color={isLiked ? "failure" : "gray"}
                                    onClick={handleLike}
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


                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-4">
                                <Link to="/">
                                    <Button color="gray" outline>
                                        ← Back to Products
                                    </Button>
                                </Link>
                                {user && user.isAdmin && (
                                    <>
                                        <Link to={`/edit-product/${product._id}`}>
                                            <Button color="blue">
                                                Edit Product
                                            </Button>
                                        </Link>
                                        <Button color="blue" onClick={() => handleDeleteProduct(product._id)}>
                                            Delete Product
                                        </Button>
                                    </>
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
