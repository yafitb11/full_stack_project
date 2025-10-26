import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import { TProduct, TCategory } from "../types/types";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useAddToCart from "../hooks/addToCart";

const CategoryProducts = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [category, setCategory] = useState<TCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useAddToCart();

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                // Fetch category details
                const categoryResponse = await axios.get(`http://localhost:8182/categories/${categoryId}`);
                setCategory(categoryResponse.data);

                // Fetch all products and filter by category
                const productsResponse = await axios.get("http://localhost:8182/products");
                const categoryProducts = productsResponse.data.filter(
                    (product: TProduct) => product.category === categoryResponse.data.name
                );
                setProducts(categoryProducts);
            } catch (error) {
                console.error("Error fetching category products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategoryAndProducts();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Category not found
                    </h1>
                    <Link to="/categories">
                        <Button color="blue">Back to Categories</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {category.name}
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
                            onClick={() => nav(`/create-product?category=${category.name}`)}
                            className="flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Add Product to {category.name}</span>
                        </Button>
                    )}
                </div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product._id} className="h-full hover:shadow-lg transition-shadow duration-300">
                            <Link to={`/product/${product._id}`}>
                                <div className="aspect-w-16 aspect-h-9 mb-4">
                                    <img
                                        src={product.image.url}
                                        alt={product.image.alt}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${product._id}`}>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        ${product.price}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {product.likes.length} likes
                                    </span>
                                </div>
                                {user && !user.isAdmin && (
                                    <Button
                                        color="blue"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                        }}
                                        className="w-full flex items-center justify-center space-x-2"
                                    >
                                        <FaShoppingCart />
                                        <span>Add to Cart</span>
                                    </Button>
                                )}
                            </div>
                        </Card>
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
