import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label, Select } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { TProduct, TCategory } from "../types/cardType";

const EditProduct = () => {
    const { id } = useParams<{ id: string }>();
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
    const [productLoading, setProductLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await axios.get("http://localhost:8182/categories");
                setCategories(categoriesResponse.data);

                // Fetch product details
                if (id) {
                    const productResponse = await axios.get(`http://localhost:8182/products/${id}`);
                    const product: TProduct = productResponse.data;

                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price.toString(),
                        category: product.category,
                        imageUrl: product.image.url,
                        imageAlt: product.image.alt
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load product data", { autoClose: 2000 });
            } finally {
                setProductLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.isAdmin) {
            toast.error("Only admins can edit products", { autoClose: 2000 });
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

            await axios.put(`http://localhost:8182/products/${id}`, productData);

            toast.success("Product updated successfully!", { autoClose: 2000 });
            navigate(`/product/${id}`);

        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product. Please try again.", { autoClose: 2000 });
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
                        You need to be logged in to edit products.
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
                        Only administrators can edit products.
                    </p>
                </div>
            </div>
        );
    }

    if (productLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Edit Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Update product information
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
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
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
                                {loading ? "Updating..." : "Update Product"}
                            </Button>
                            <Button
                                type="button"
                                color="gray"
                                onClick={() => navigate(`/product/${id}`)}
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

export default EditProduct;
