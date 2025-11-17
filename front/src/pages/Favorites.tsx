import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TRootState } from "./../store/store";
import { TProduct } from "../types/types";
import useAuth from "../hooks/useAuth";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Pagination } from "flowbite-react";
import { searchActions } from "../store/searchSlice";
import { useDispatch } from "react-redux";
import useLikeProduct from "../hooks/useLikeProduct";
import useAddToCart from "../hooks/useAddToCart";

const Favorites = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [spinner, setSpinner] = useState<boolean>(false);
    const nav = useNavigate();
    const search = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const currentPage = useSelector((state: TRootState) => state.searchSlice.currentPage);
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();

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

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Please Login
                </h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    My Favorites
                </h1>

                {spinner ? (
                    <div className="text-center">
                        <Spinner color="purple" aria-label="Loading favorites" />
                        <p className="mt-4 text-gray-600">Loading your favorites...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                            You haven't liked any products yet.
                        </p>
                        <Button color="blue" href="/">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map((product) => (
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
                                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                ${product.price}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {product.likes.length} likes
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Button
                                                color="blue"
                                                onClick={() => nav(`/product/${product._id}`)}
                                            >
                                                View Details
                                            </Button>
                                            <div className="flex space-x-2">
                                                <FaHeart
                                                    className="text-red-500 cursor-pointer text-xl"
                                                    onClick={() => unlikeProduct(product._id)}
                                                />
                                                {!user.isAdmin && (
                                                    <FaShoppingCart
                                                        className="text-blue-500 cursor-pointer text-xl"
                                                        onClick={() => addToCart(product)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="flex overflow-x-auto sm:justify-center mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => dispatch(searchActions.setCurrentPage(page))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Favorites;

