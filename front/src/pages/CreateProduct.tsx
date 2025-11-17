import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label, Radio } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { newProductSchema } from "../validations/newProduct.joi";
import { productFormData } from "../types/formData";
import { TCategory } from "../types/types";

export default function CreateProduct() {
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        unregister,
        formState: { errors, isValid },
    } = useForm<productFormData>({
        mode: "onChange",
        resolver: joiResolver(newProductSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            image: { url: "", alt: "" },
            category_id: "",
            quantityInStock: 0,
            price: 0,
            isDiscount: false,
        },
    });

    const isDiscounted = watch("isDiscount") === true;

    useEffect(() => {
        if (isDiscounted) {
            register("discountedPrice");
            setValue("discountedPrice", 0);
        } else {
            unregister("discountedPrice");
        }
    }, [isDiscounted, register, unregister, setValue]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8182/categories");
                setCategories(response.data);

                const categoryFromUrl = searchParams.get("category");
                if (categoryFromUrl) {
                    const matchedCategory = response.data.find(
                        (cat: TCategory) => cat.title === categoryFromUrl
                    );
                    if (matchedCategory) {
                        setValue("category_id", matchedCategory._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [searchParams, setValue]);

    const onSubmit = async (data: productFormData) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;

            const productData = {
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                price: data.price,
                category_id: data.category_id,
                quantityInStock: data.quantityInStock,
                image: {
                    url: data.image.url || "",
                    alt: data.image.alt || data.title,
                },
                isDiscount: data.isDiscount,
                ...(data.isDiscount && data.discountedPrice && {
                    discountedPrice: data.discountedPrice
                }),
            };

            await axios.post("http://localhost:8182/products", productData);

            toast.success("Product created successfully!", { autoClose: 2000 });
            navigate(-1);
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Failed to create product. Please try again.", { autoClose: 2000 });
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
        <div className="formPageDiv">
            <div className="formSecondDiv">
                <div className="formTitleDiv">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Create New Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Add a new product to the store</p>
                </div>

                <Card className="formCard">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div>
                            <Label htmlFor="title" value="Product Title" />
                            <TextInput id="title" {...register("title")} />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="subtitle" value="Product Subtitle" />
                            <TextInput id="subtitle" {...register("subtitle")} />
                            {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea id="description" rows={4} {...register("description")} />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="price" value="Price" />
                            <TextInput type="number" step="0.01" id="price" {...register("price")} />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="category_id" value="Category" />
                            {searchParams.get("category") ? (
                                <div className="relative">
                                    <div className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-white cursor-not-allowed">
                                        {categories.find(cat => cat._id === watch("category_id"))?.title || "Loading..."}
                                    </div>
                                    <input
                                        type="hidden"
                                        {...register("category_id")}
                                        value={watch("category_id")}
                                    />
                                </div>
                            ) : (
                                <select
                                    id="category_id"
                                    {...register("category_id")}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    value={watch("category_id")}
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
                            {searchParams.get("category") && (
                                <p className="text-sm text-blue-600 mt-1">Category pre-selected from category page</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="image.url" value="Image URL" />
                            <TextInput id="image.url" {...register("image.url")} />
                            {errors.image?.url && <p className="text-red-500 text-sm mt-1">{errors.image.url.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="image.alt" value="Image Alt Text" />
                            <TextInput id="image.alt" {...register("image.alt")} />
                            {errors.image?.alt && <p className="text-red-500 text-sm mt-1">{errors.image.alt.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="quantityInStock" value="Quantity in Stock" />
                            <TextInput type="number" id="quantityInStock" {...register("quantityInStock")} />
                            {errors.quantityInStock && <p className="text-red-500 text-sm mt-1">{errors.quantityInStock.message}</p>}
                        </div>

                        <fieldset className="flex gap-3 items-center">
                            <legend className="mb-1 text-gray-700 dark:text-gray-200">Is there a Discount?</legend>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="discountYes"
                                    name="isDiscount"
                                    value="true"
                                    onChange={() => setValue("isDiscount", true, { shouldValidate: true })}
                                    checked={watch("isDiscount") === true}
                                />
                                <Label htmlFor="discountYes">Yes</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Radio
                                    id="discountNo"
                                    name="isDiscount"
                                    value="false"
                                    onChange={() => setValue("isDiscount", false, { shouldValidate: true })}
                                    checked={watch("isDiscount") === false}
                                />
                                <Label htmlFor="discountNo">No</Label>
                            </div>
                        </fieldset>

                        {isDiscounted && (
                            <div>
                                <Label htmlFor="discountedPrice" value="Discounted Price" />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    id="discountedPrice"
                                    {...register("discountedPrice")}
                                />
                                {errors.discountedPrice && <p className="text-red-500 text-sm mt-1">{errors.discountedPrice.message}</p>}
                            </div>
                        )}

                        <div className="buttonsDiv">
                            <Button type="submit" color="blue" disabled={loading || !isValid} className="flex-1">
                                {loading ? "Creating..." : "Create Product"}
                            </Button>
                            <Button type="button" color="gray" onClick={() => {
                                navigate(-1);
                            }} className="flex-1">
                                Cancel
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
}