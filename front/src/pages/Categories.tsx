import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import { TCategory } from "../types/cardType";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Categories = () => {
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:3000/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Product Categories
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Browse our wide selection of product categories
                </p>
                {user && user.isAdmin && (
                    <div className="flex justify-center">
                        <Button
                            color="blue"
                            onClick={() => navigate("/create-category")}
                            className="flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Create New Category</span>
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link key={category._id} to={`/categories/${category._id}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                            <div className="aspect-w-16 aspect-h-9 mb-4">
                                <img
                                    src={category.image.url}
                                    alt={category.image.alt}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {category.description}
                                </p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No categories available at the moment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Categories;
