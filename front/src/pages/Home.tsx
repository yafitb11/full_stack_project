import axios from "axios";
import { Button, Card, Spinner } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { TProduct, TCategory } from "../types/types";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
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
    const { state } = useLocation();


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
                <h1>
                    Welcome to E-Shop
                </h1>
                <p>
                    Discover amazing products at great prices
                </p>
                {user && user.isAdmin && (
                    <div className="pageAdminButtonsDiv">
                        <Button
                            color="blue"
                            onClick={() => nav("/create-product")}
                            className="flex items-center space-x-2 dark:!bg-slate-800 dark:text-slate-200"
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

            <div className="pageCardsDiv">
                {products && paginatedProducts.map((product) => {
                    const isLiked = user ? product.likes.includes(user._id) : false;
                    return (
                        <Card key={product._id} className="mycard" >
                            <div className="imageDiv">
                                <img
                                    src={product.image.url}
                                    alt={product.image.alt}
                                />
                            </div>

                            <div className="textDiv">
                                <p className="text-gray-800 dark:text-gray-400 mb-3">
                                    {(product.category_id as TCategory)?.title}
                                </p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {product.title}
                                </h3>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {product.subtitle}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    {product.description}
                                </p>

                                <div>
                                    <span className={`font-bold ${product.isDiscount ? "text-xl text-blue-400 dark:text-blue-700" : "text-2xl text-blue-600 dark:text-blue-400"}`}>
                                        ${product.price}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {product.likes.length} likes
                                    </span>
                                </div>

                                {product.isDiscount && (
                                    <p className="text-2xl font-bold text-blue-600 mt-2 dark:text-blue-400">
                                        In discount ${product.discountedPrice} !
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
                                                className="text-black dark:text-white cursor-pointer text-2xl hover:text-green-500 dark:hover:text-green-500"
                                                onClick={() => nav(`/edit-product/${product._id}`)}
                                                title="Edit product"
                                            />
                                            <FaTrash
                                                className="text-black dark:text-white cursor-pointer text-xl hover:text-red-600 dark:hover:text-red-600"
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

