import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { TProduct } from "../types/types";
import useAuth from "../hooks/useAuth";
import { Pagination } from "flowbite-react";
import { useDispatch } from "react-redux";
import { searchActions } from "../store/searchSlice";
import useAddToCart from "../hooks/useAddToCart";
import useLikeProduct from "../hooks/useLikeProduct";
import deleteProduct from "../hooks/useDeleteProduct";
import ProductCard from "../components/ProductCard";
import ViewButtons from "../components/ViewButtons";

const Home = () => {
    const [viewMode, setViewMode] = useState<"large" | "compact">(
        () => (localStorage.getItem("viewMode") as "large" | "compact") || "large"
    );
    const [products, setProducts] = useState<TProduct[]>([]);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState<boolean>(false);
    const search = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const currentPage = useSelector((state: TRootState) => state.searchSlice.currentPage);
    const { user } = useAuth();
    const { addToCart } = useAddToCart();
    const { state } = useLocation();

    const handleViewModeChange = (mode: "large" | "compact") => {
        setViewMode(mode);
        localStorage.setItem("viewMode", mode);
    };

    useEffect(() => {
        if (state?.error) {
            alert(state.error);
            window.history.replaceState({}, document.title);
        }
    }, [state]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setSpinner(true);
                const response = await axios.get("http://localhost:8182/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setSpinner(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(
            (product) =>
                product.title?.toLowerCase().includes(search.toLowerCase()) ||
                product.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * 12;
        const end = start + 12;
        return filteredProducts.slice(start, end);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / 12);

    const { toggleLike } = useLikeProduct();
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

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <div className="relative ">
                    <ViewButtons viewMode={viewMode} onChange={handleViewModeChange}></ViewButtons>
                    <h1>Welcome to E-Shop</h1>
                </div>

                <p>Discover amazing products at great prices</p>

                {user && user.isAdmin && (
                    <div className="pageAdminButtonsDiv">
                        <Button
                            color="blue"
                            onClick={() => nav("/create-product")}
                            className="flex items-center space-x-2 dark:!bg-slate-800 dark:text-slate-200 border-white"
                        >
                            <span>+</span>
                            <span>Create New Product</span>
                        </Button>
                    </div>
                )}
            </div>

            {spinner && (
                <div className="text-center">
                    <Spinner color="purple" aria-label="Loading products" />
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            )}

            {!spinner && paginatedProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {search ? 'No products found matching your search.' : 'No products available.'}
                    </p>
                </div>
            )}

            <div className={viewMode === 'large' ? "pageCardsDiv" : "flex justify-center flex-wrap !gap-7"}>
                {products && paginatedProducts.map((product) => (
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

            <div className="flex overflow-x-auto justify-center mt-8">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => dispatch(searchActions.setCurrentPage(page))}
                />
            </div>
        </div>
    );
};

export default Home;