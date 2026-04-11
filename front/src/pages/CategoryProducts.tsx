import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { TProduct, TCategory } from "../types/types";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/useAddToCart";
import useLikeProduct from "../hooks/useLikeProduct";
import deleteProduct from "../hooks/useDeleteProduct";
import ProductCard from "../components/ProductCard";
import ViewButtons from "../components/ViewButtons";
import api from "../api/api";

const CategoryProducts = () => {
    const [viewMode, setViewMode] = useState<"large" | "compact">(
        () => (localStorage.getItem("viewMode") as "large" | "compact") || "large"
    );
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [category, setCategory] = useState<TCategory | null>(null);
    const [spinner, setSpinner] = useState<boolean>(false);
    const nav = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();
    const { toggleLike } = useLikeProduct();

    const handleViewModeChange = (mode: "large" | "compact") => {
        setViewMode(mode);
        localStorage.setItem("viewMode", mode);
    };

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                setSpinner(true);
                const categoryResponse = await api.get(
                    `/categories/${categoryId}?populate=true`
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
                <div className="relative">
                    <ViewButtons viewMode={viewMode} onChange={handleViewModeChange} ></ViewButtons>
                    <h1>{category.title}</h1>
                </div>
                <p>{category.description} </p>

                <div className="pageAdminButtonsDiv gap-4 flex-wrap">
                    <Link to="/categories">
                        <Button color="blue" className="dark:!bg-slate-800 dark:text-slate-200 dark:border-white">
                            ← Back to All Categories
                        </Button>
                    </Link>
                    {user && user.isAdmin && (
                        <Button
                            onClick={() => nav(`/create-product?category=${category.title}`)}
                            className="flex items-center space-x-2 dark:!bg-slate-200 dark:text-black dark:border-black"
                        >
                            <span>+</span>
                            <span>Add Product to {category.title}</span>
                        </Button>
                    )}
                </div>
            </div>

            {products.length > 0 ? (
                <div className={viewMode === 'large' ? "pageCardsDiv" : "flex justify-center flex-wrap !gap-7"}>
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            variant={viewMode}
                            isLiked={user ? product.likes.includes(user._id) : false}
                            onLike={() => handleLike(product._id)}
                            onDelete={() => handleDeleteProduct(product._id)}
                            onAddToCart={() => addToCart(product)}
                            onEdit={() => nav(`/edit-product/${product._id}`)}
                            onNavigate={() => nav(`/product/${product._id}`)}
                            isAdmin={user?.isAdmin || false}
                        />
                    ))}
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