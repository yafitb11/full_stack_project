import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button, Spinner } from "flowbite-react";
import { TProduct, TCategory } from "../types/types";
import { FaHeart, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/useAddToCart";
import useLikeProduct from "../hooks/useLikeProduct";
import deleteProduct from "../hooks/useDeleteProduct";

const CategoryProducts = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [category, setCategory] = useState<TCategory | null>(null);
    const [spinner, setSpinner] = useState<boolean>(false);
    const nav = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();
    const { toggleLike } = useLikeProduct();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                setSpinner(true);
                // Fetch category details
                const categoryResponse = await axios.get(
                    `http://localhost:8182/categories/${categoryId}?populate=true`
                );
                setCategory(categoryResponse.data);

                setProducts(categoryResponse.data.products || []);
            } catch (error) {
                console.error("Error fetching category products:", error);
                nav("/not-found", { replace: true });
            } finally {
                setSpinner(false);
            }
        };

        if (categoryId) fetchCategoryAndProducts();
    }, [categoryId, nav]);

    const handleLike = async (productId: string) => {
        if (!user) return;
        const product = products.find((p) => p._id === productId);
        if (!product) return;
        const isLiked = product.likes.includes(user._id);

        setProducts((prevProductsArr) =>
            prevProductsArr.map((p) => {
                if (p._id !== productId) return p;

                return {
                    ...p,
                    likes: isLiked
                        ? p.likes.filter((id) => id !== user._id)
                        : [...p.likes, user._id],
                };
            })
        );

        await toggleLike(productId, product.likes.includes(user._id));
    };

    const handleDeleteProduct = async (productId: string) => {
        deleteProduct(productId);
        setProducts(products.filter((product) => product._id !== productId));
    };

    if (spinner) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <Spinner color="purple" aria-label="Loading products" />
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (category) {

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {category.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        {category.description}
                    </p>
                    <div className="flex space-x-4 justify-center">
                        <Link to="/categories">
                            <Button color="gray" outline>
                                ← Back to All Categories
                            </Button>
                        </Link>
                        {user && user.isAdmin && (
                            <Button
                                color="blue"
                                onClick={() => nav(`/create-product?category=${category.title}`)}
                                className="flex items-center space-x-2"
                            >
                                <span>+</span>
                                <span>Add Product to {category.title}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const isLiked = user ? product.likes.includes(user._id) : false;
                            return (
                                <Card key={product._id} className="h-full hover:shadow-lg transition-shadow duration-300">
                                    <div className="aspect-w-16 aspect-h-9 mb-4">
                                        <img
                                            src={product.image.url}
                                            alt={product.image.alt}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            {product.title}
                                        </h3>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {product.subtitle}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className={`font-bold ${product.isDiscount ? "text-xl text-blue-400 dark:text-blue-300" : "text-2xl text-blue-600 dark:text-blue-400"}`}>
                                                ${product.price}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {product.likes.length} likes
                                            </span>
                                        </div>
                                        {product.isDiscount && (
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                                product is in discount! ${product.discountedPrice}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <Button
                                                color="blue"
                                                onClick={() => nav(`/product/${product._id}`)}
                                            >
                                                View Details
                                            </Button>
                                            <div className="flex space-x-2">
                                                {user && user.isAdmin && (
                                                    <>
                                                        <FaEdit
                                                            className="text-green-500 cursor-pointer text-xl hover:text-green-600"
                                                            onClick={() => nav(`/update-product/${product._id}`)}
                                                            title="Edit product"
                                                        />
                                                        <FaTrash
                                                            className="text-red-500 cursor-pointer text-xl hover:text-red-600"
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            title="Delete product"
                                                        />
                                                    </>
                                                )}
                                                {user && !user.isAdmin && (
                                                    <>
                                                        <FaHeart
                                                            className={`${isLiked ? "text-red-500" : "text-gray-500"} cursor-pointer text-xl`}
                                                            onClick={() => handleLike(product._id)}
                                                        />
                                                        <FaShoppingCart
                                                            className="text-blue-500 cursor-pointer text-xl"
                                                            onClick={() => addToCart(product)}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No products found in this category.
                        </p>
                    </div>
                )}
            </div>
        );
    };
}

export default CategoryProducts;