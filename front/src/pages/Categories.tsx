import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import { TCategory } from "../types/types";
//import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../api/api";

const Categories = () => {
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const deleteCategory = async (categoryId: string) => {
        //   const token = localStorage.getItem("token");

        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                //   axios.defaults.headers.common["x-auth-token"] = token;
                await api.delete(`/categories/${categoryId}`);
                toast.success("Category deleted successfully", { autoClose: 2000 });
                setCategories(prev => prev.filter(category => category._id !== categoryId));
            } catch (error) {
                console.log("Error deleting category:", error);
                toast.error("Failed to delete category", { autoClose: 2000 });
            }
        }

    };


    if (loading) {
        return (
            <div className="pageDiv">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pageDiv">
            <div className="pageTextAndButtonsDiv">
                <h1>
                    Product Categories
                </h1>
                <p>
                    Browse our wide selection of product categories
                </p>
                {user && user.isAdmin && (
                    <div className="pageAdminButtonsDiv">
                        <Button
                            color="blue"
                            onClick={() => navigate("/create-category")}
                            className="flex items-center space-x-2 dark:!bg-slate-800 dark:text-slate-200 border-white"
                        >
                            <span>+</span>
                            <span>Create New Category</span>
                        </Button>
                    </div>
                )}
            </div>

            <div className="pageCardsDiv">
                {categories.map((category) => (
                    <Card key={category._id} className="mycard">
                        <div className="imageDiv">
                            <img
                                src={category.image.url}
                                alt={category.image.alt}
                            />
                        </div>

                        <div className="textDiv !px-8">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-2">
                                {category.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {category.description}
                            </p>
                        </div>

                        <div className="cardButtonsDiv">
                            <Button
                                color="blue"
                                onClick={() => navigate(`/categories/${category._id}`)}
                            >
                                View Products
                            </Button>
                            <div className="flex space-x-2">
                                {user && user.isAdmin && (
                                    <>
                                        <MdEdit
                                            className="text-black dark:text-white cursor-pointer text-2xl hover:text-green-500 dark:hover:text-green-500"
                                            onClick={() => navigate(`/edit-category/${category._id}`)}
                                            title="Edit category"
                                        />
                                        <FaTrash
                                            className="text-black dark:text-white cursor-pointer text-xl hover:text-red-600 dark:hover:text-red-600"
                                            onClick={() => deleteCategory(category._id)}
                                            title="Delete category"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
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
