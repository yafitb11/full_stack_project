import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TRootState } from "./../store/store";
import { TProduct } from "../types/types";
import useAuth from "../hooks/useAuth";
import { Pagination } from "flowbite-react";
import { searchActions } from "../store/searchSlice";
import { useDispatch } from "react-redux";
import useLikeProduct from "../hooks/useLikeProduct";
import useAddToCart from "../hooks/useAddToCart";
import ViewButtons from "../components/ViewButtons";
import ProductCard from "../components/ProductCard";

const Favorites = () => {
    const [viewMode, setViewMode] = useState<"large" | "compact">(
        () => (localStorage.getItem("viewMode") as "large" | "compact") || "large"
    );
    const [products, setProducts] = useState<TProduct[]>([]);
    const [spinner, setSpinner] = useState<boolean>(false);
    const nav = useNavigate();
    const search = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const currentPage = useSelector((state: TRootState) => state.searchSlice.currentPage);
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();

    const handleViewModeChange = (mode: "large" | "compact") => {
        setViewMode(mode);
        localStorage.setItem("viewMode", mode);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setSpinner(true);
                const response = await axios.get("http://localhost:8182/products");

                const likedProducts = response.data.filter((item: TProduct) => {
                    return user ? item.likes.includes(user._id) : false;
                });
                setProducts(likedProducts);

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setSpinner(false);
            }
        };

        fetchProducts();
    }, [user?._id]);

    const filteredProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * 12;
        return filteredProducts.slice(start, start + 12);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / 12);

    const { toggleLike } = useLikeProduct();
    const unlikeProduct = async (productId: string) => {
        if (!user) return;
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        await toggleLike(productId, true);
    };

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <div className="relative ">
                    <ViewButtons viewMode={viewMode} onChange={handleViewModeChange}></ViewButtons>
                    <h1>My Favorites</h1>
                </div>
                <p>All the items you liked in one curated list.</p>
            </div>

            {spinner && (
                <div className="text-center">
                    <Spinner color="purple" aria-label="Loading favorites" />
                    <p className="mt-4 text-gray-600">Loading your favorites...</p>
                </div>
            )}

            {!spinner && !user && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                        Please log in to view your favorites.
                    </p>
                    <Button color="blue" href="/signin">
                        Go to Sign In
                    </Button>
                </div>
            )}

            {!spinner && user && paginatedProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-2xl mb-9">
                        You haven't liked any products yet.
                    </p>
                    <Button color="blue" href="/" className=" w-[45%] m-auto dark:!bg-slate-800 dark:text-slate-200 dark:!border-white">
                        Start Shopping
                    </Button>
                </div>
            )}

            {!spinner && user && paginatedProducts.length > 0 && (
                <>
                    <div className={viewMode === 'large' ? "pageCardsDiv" : "flex justify-center flex-wrap !gap-7"}>
                        {products && paginatedProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                variant={viewMode}
                                isLiked={user ? product.likes.includes(user._id) : false}
                                onLike={() => unlikeProduct(product._id)}
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
                </>
            )}
        </div>
    );
};

export default Favorites;

