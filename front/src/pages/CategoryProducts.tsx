import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button, Spinner } from "flowbite-react";
import { TProduct, TCategory } from "../types/types";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
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
        const success = await deleteProduct(productId);
        if (success) {
            setProducts((prev) => prev.filter((product) => product._id !== productId));
        }
    };

    if (spinner) {
        return (
            <div className="pageDiv">
                <div className="text-center">
                    <Spinner color="purple" aria-label="Loading products" />
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="pageDiv">
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Category not found.
                    </p>
                    <Link to="/categories" className="inline-block mt-4">
                        <Button color="blue">Go Back</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1>
                    {category.title}
                </h1>
                <p>
                    {category.description}
                </p>
                <div className="pageAdminButtonsDiv gap-4 flex-wrap">
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
                <div className="pageCardsDiv">
                    {products.map((product) => {
                        const isLiked = user ? product.likes.includes(user._id) : false;
                        return (
                            <Card key={product._id} className="mycard">
                                <div className="imageDiv">
                                    <img
                                        src={product.image.url}
                                        alt={product.image.alt}
                                    />
                                </div>

                                <div className="textDiv">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
                                        {product.title}
                                    </h3>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {product.subtitle}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {product.description}
                                    </p>

                                    <div>
                                        <span className={`font-bold ${product.isDiscount ? "text-xl text-blue-400 dark:text-blue-300" : "text-2xl text-blue-600 dark:text-blue-400"}`}>
                                            ${product.price}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {product.likes.length} likes
                                        </span>
                                    </div>
                                    {product.isDiscount && (
                                        <p className="text-xl font-bold text-blue-600 mt-2 dark:text-blue-400">
                                            Now in discount ${product.discountedPrice} !
                                        </p>
                                    )}
                                </div>

                                <div className="cardButtonsDiv">
                                    <Button
                                        color="blue"
                                        onClick={() => nav(`/product/${product._id}`)}
                                    >
                                        View Details
                                    </Button>
                                    <div className="flex space-x-2">
                                        {user && user.isAdmin && (
                                            <>
                                                <MdEdit
                                                    className="text-black cursor-pointer text-2xl hover:text-green-500"
                                                    onClick={() => nav(`/edit-product/${product._id}`)}
                                                    title="Edit product"
                                                />
                                                <FaTrash
                                                    className="text-black cursor-pointer text-xl hover:text-red-600"
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

export default CategoryProducts;