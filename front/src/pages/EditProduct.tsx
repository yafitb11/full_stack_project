import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, TextInput, Textarea, Label, Radio } from "flowbite-react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { newProductSchema } from "../validations/newProduct.joi";
import { productFormData } from "../types/formData";
import { TProduct } from "../types/types";

export default function EditProduct() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState<TProduct>();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8182/products/${id}`,
                );

                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };
        fetchProductDetails();
    }, [id]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        unregister,
        formState: { errors, isValid },
        reset,
    } = useForm<productFormData>({
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            image: { url: "", alt: "" },
            quantityInStock: 0,
            price: 0,
            isDiscount: false,
        },
        mode: "onChange",
        resolver: joiResolver(newProductSchema),
    });

    useEffect(() => {
        if (product) {
            reset({
                title: product?.title,
                subtitle: product?.subtitle || "",
                description: product?.description,
                image: { url: product?.image.url, alt: product?.image.alt },
                quantityInStock: product?.quantityInStock,
                price: product?.price,
                isDiscount: product?.isDiscount ?? false,
            });
        }
    }, [product, reset]);

    const isDiscounted = watch("isDiscount") === true;

    useEffect(() => {
        if (isDiscounted) {
            register("discountedPrice");
            setValue("discountedPrice", product?.discountedPrice);
        } else {
            unregister("discountedPrice");
        }
    }, [isDiscounted, register, unregister, setValue, product]);


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

            await axios.put(`http://localhost:8182/products/${product?._id}`, productData);

            toast.success("Product updated successfully!", { autoClose: 2000 });
            navigate(-1);
        } catch (error) {
            console.error("Error editing product:", error);
            toast.error("Failed to edit product. Please try again.", { autoClose: 2000 });
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
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Edit Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Add a new product to the store</p>
                </div>

                <Card className="p-6">
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

                        <div className="flex space-x-4">
                            <Button type="submit" color="blue" disabled={loading || !isValid} className="flex-1">
                                {loading ? "Loading..." : "Edit Product"}
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