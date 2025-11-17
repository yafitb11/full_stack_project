import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { TProduct, TCategory } from "../types/types";
import { FaHeart, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { Pagination } from "flowbite-react";
import { useDispatch } from "react-redux";
import { searchActions } from "../store/searchSlice";
import useAddToCart from "../hooks/useAddToCart";
import useLikeProduct from "../hooks/useLikeProduct";
import deleteProduct from "../hooks/useDeleteProduct";

const Home = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [spinner, setSpinner] = useState<boolean>(false);
    const search = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const currentPage = useSelector((state: TRootState) => state.searchSlice.currentPage);
    const { user } = useAuth();
    const { addToCart } = useAddToCart();

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
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to E-Shop
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Discover amazing products at great prices
                </p>
                {user && user.isAdmin && (
                    <div className="flex justify-center">
                        <Button
                            color="blue"
                            onClick={() => nav("/create-product")}
                            className="flex items-center space-x-2"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products && paginatedProducts.map((product) => {
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
                                <p className="text-gray-800 dark:text-gray-400 mb-3 line-clamp-2">
                                    {(product.category_id as TCategory)?.title}
                                </p>
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
                                                    onClick={() => nav(`/edit-product/${product._id}`)}
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

            <div className="flex overflow-x-auto sm:justify-center mt-8">
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

