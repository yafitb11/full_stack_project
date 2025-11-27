import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { TCategory } from "../types/types";
import { newCategorySchema } from "../validations/newCategory.joi";
import { TCategoryFormData } from "../types/formData";

export default function EditCategory() {
    const [category, setCategory] = useState<TCategory>();
    const [loading, setLoading] = useState(false);

    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8182/categories/${id}`
                );
                setCategory(response.data);
            } catch (error) {
                console.error("Error fetching category details:", error);
            }
        };
        fetchCategoryDetails();
    }, [id]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<TCategoryFormData>({
        defaultValues: {
            title: "",
            description: "",
            image: { url: "", alt: "" }
        },
        mode: "onChange",
        resolver: joiResolver(newCategorySchema)
    });

    useEffect(() => {
        if (category) {
            reset({
                title: category.title,
                description: category.description,
                image: {
                    url: category.image.url,
                    alt: category.image.alt
                }
            });
        }
    }, [category, reset]);


    const onSubmit = async (data: TCategoryFormData) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;

            const updatedCategory = {
                title: data.title,
                description: data.description,
                image: {
                    url: data.image.url || "",
                    alt: data.image.alt || data.title
                }
            };

            await axios.put(
                `http://localhost:8182/categories/${category?._id}`,
                updatedCategory
            );

            toast.success("Category updated successfully!", { autoClose: 2000 });
            navigate(-1);

        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category. Please try again.", { autoClose: 2000 });

        } finally {
            setLoading(false);
        }
    };


    if (!user || !user.isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    You must be the Admin to watch this Page!
                </h1>
            </div>
        );
    }


    return (
        <div className="pageDiv">
            <div className="formSecondDiv">

                <div className="formTitleDiv">
                    <h1>Edit Category</h1>
                    <p>Edit this category</p>
                </div>

                <Card className="formCard">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div>
                            <Label htmlFor="title" value="Category Title" />
                            <TextInput id="title" {...register("title")} />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                rows={4}
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="image.url" value="Image URL" />
                            <TextInput id="image.url" {...register("image.url")} />
                            {errors.image?.url && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.image.url.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="image.alt" value="Image Alt Text" />
                            <TextInput id="image.alt" {...register("image.alt")} />
                            {errors.image?.alt && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.image.alt.message}
                                </p>
                            )}
                        </div>

                        <div className="buttonsDiv">
                            <Button
                                type="submit"
                                color="blue"
                                disabled={loading || !isValid}
                                className="flex-1"
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </Button>

                            <Button
                                type="button"
                                color="gray"
                                onClick={() => navigate(-1)}
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
}
