import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label, Select } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { TCategory } from "../types/types";

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        imageAlt: ""
    });
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8182/categories");
                setCategories(response.data);

                // Check if category is provided in URL
                const categoryFromUrl = searchParams.get('category');
                if (categoryFromUrl) {
                    setFormData(prev => ({
                        ...prev,
                        category: categoryFromUrl
                    }));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.isAdmin) {
            toast.error("Only admins can create products", { autoClose: 2000 });
            return;
        }

        // Validation
        if (!formData.name || !formData.description || !formData.price || !formData.category) {
            toast.error("Please fill in all required fields", { autoClose: 2000 });
            return;
        }

        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            toast.error("Please enter a valid price", { autoClose: 2000 });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                image: {
                    url: formData.imageUrl || "https://via.placeholder.com/300x200?text=No+Image",
                    alt: formData.imageAlt || formData.name
                }
            };

            await axios.post("http://localhost:8182/products", productData);

            toast.success("Product created successfully!", { autoClose: 2000 });
            navigate("/");

        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Failed to create product. Please try again.", { autoClose: 2000 });
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
                        You need to be logged in to create products.
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
                        Only administrators can create products.
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
                        Create New Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add a new product to the store
                    </p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name" value="Product Name *" />
                            <TextInput
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter product name"
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
                                placeholder="Enter product description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="price" value="Price *" />
                            <TextInput
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category" value="Category *" />
                            <Select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={!!searchParams.get('category')}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                            {searchParams.get('category') && (
                                <p className="text-sm text-blue-600 mt-1">
                                    Category pre-selected from category page
                                </p>
                            )}
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
                                {loading ? "Creating..." : "Create Product"}
                            </Button>
                            <Button
                                type="button"
                                color="gray"
                                onClick={() => navigate("/")}
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

export default CreateProduct;
