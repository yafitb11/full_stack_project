import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const CreateCategory = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        imageAlt: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.isAdmin) {
            toast.error("Only admins can create categories", { autoClose: 2000 });
            return;
        }

        // Validation
        if (!formData.name || !formData.description) {
            toast.error("Please fill in all required fields", { autoClose: 2000 });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;

            const categoryData = {
                name: formData.name,
                description: formData.description,
                image: {
                    url: formData.imageUrl || "https://via.placeholder.com/300x200?text=No+Image",
                    alt: formData.imageAlt || formData.name
                }
            };

            await axios.post("http://localhost:3000/categories", categoryData);

            toast.success("Category created successfully!", { autoClose: 2000 });
            navigate("/categories");

        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Failed to create category. Please try again.", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please Login
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be logged in to create categories.
                    </p>
                </div>
            </div>
        );
    }

    if (!user.isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Only administrators can create categories.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Create New Category
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add a new product category to the store
                    </p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name" value="Category Name *" />
                            <TextInput
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter category name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" value="Description *" />
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter category description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="imageUrl" value="Image URL" />
                            <TextInput
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty to use placeholder image
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="imageAlt" value="Image Alt Text" />
                            <TextInput
                                id="imageAlt"
                                name="imageAlt"
                                type="text"
                                placeholder="Describe the image"
                                value={formData.imageAlt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                type="submit"
                                color="blue"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? "Creating..." : "Create Category"}
                            </Button>
                            <Button
                                type="button"
                                color="gray"
                                onClick={() => navigate("/categories")}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateCategory;
