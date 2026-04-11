import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
//import axios from "axios";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { newCategorySchema } from "../validations/newCategory.joi";
import { TCategoryFormData } from "../types/formData";
import api from "../api/api";

const CreateCategory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<TCategoryFormData>({
        mode: "onChange",
        resolver: joiResolver(newCategorySchema),
        defaultValues: {
            title: "",
            description: "",
            image: {
                url: "",
                alt: ""
            }
        }
    });

    const onSubmit = async (formData: TCategoryFormData) => {
        if (!user?.isAdmin) {
            toast.error("Only admins can create categories");
            return;
        }

        setLoading(true);

        try {
            // const token = localStorage.getItem("token");
            //  axios.defaults.headers.common["x-auth-token"] = token;

            const categoryData = {
                title: formData.title,
                description: formData.description,
                image: {
                    url: formData.image.url || "",
                    alt: formData.image.alt || formData.title
                }
            };

            await api.post("/categories", categoryData);

            toast.success("Category created successfully!", { autoClose: 2000 });
            navigate("/categories");
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Failed to create category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pageDiv">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Please Login</h1>
                    <p>You need to be logged in to create categories.</p>
                </div>
            </div>
        );
    }

    if (!user.isAdmin) {
        return (
            <div className="pageDiv">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p>Only administrators can create categories.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pageDiv">
            <div className="formSecondDiv">
                <div className="pageTextAndButtonsDiv">
                    <h1>Create a New Category</h1>
                    <p>Add a new products category to the store</p>
                </div>

                <Card className="formCard">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Title */}
                        <div>
                            <Label htmlFor="title" value="*Category Title" />
                            <TextInput id="title" {...register("title")} />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea id="description" rows={4} {...register("description")} />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Image URL */}
                        <div>
                            <Label htmlFor="image.url" value="Image URL" />
                            <TextInput id="image.url" {...register("image.url")} />
                            {errors.image?.url && (
                                <p className="text-red-500 text-sm mt-1">{errors.image.url.message}</p>
                            )}
                        </div>

                        {/* Image Alt */}
                        <div>
                            <Label htmlFor="image.alt" value="Image Alt Text" />
                            <TextInput id="image.alt" {...register("image.alt")} />
                            {errors.image?.alt && (
                                <p className="text-red-500 text-sm mt-1">{errors.image.alt.message}</p>
                            )}
                        </div>

                        <div className="buttonsDiv">
                            <Button
                                type="submit"
                                color="blue"
                                disabled={loading || !isValid}
                                className="flex-1"
                            >
                                {loading ? "Creating..." : "Create Category"}
                            </Button>

                            <Button
                                type="button"
                                color="gray"
                                className="flex-1"
                                onClick={() => navigate("/categories")}
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
