import { joiResolver } from "@hookform/resolvers/joi";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { editUserSchema } from "../validations/editUser.joi";
import axios from "axios";
import { TUserFormData } from "../types/formData";
import { Tuser } from "../types/types";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

export default function EditUser() {
    const { user, autoLogIn } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [targetUser, setTargetUser] = useState<Tuser | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:8182/users/${id}`,
                );
                setTargetUser(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [id]);

    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<TUserFormData>({
        defaultValues: {
            name: {
                first: "",
                middle: "",
                last: "",
            },
            phone: 0,
            image: {
                url: "",
                alt: "",
            },
            address: {
                state: "",
                country: "",
                city: "",
                street: "",
                houseNumber: 0,
                zip: 0,
            },
        },
        mode: "onChange",
        resolver: joiResolver(editUserSchema),
    });

    useEffect(() => {
        if (targetUser) {
            reset({
                name: {
                    first: targetUser.name.first,
                    middle: targetUser.name.middle || "",
                    last: targetUser.name.last,
                },
                phone: targetUser.phone,
                image: {
                    url: targetUser.image.url,
                    alt: targetUser.image.alt,
                },
                address: {
                    state: targetUser.address.state || "",
                    country: targetUser.address.country,
                    city: targetUser.address.city,
                    street: targetUser.address.street,
                    houseNumber: targetUser.address.houseNumber,
                    zip: targetUser.address.zip,
                },
            });
        }
    }, [targetUser, reset]);


    const submitForm = async (data: TUserFormData) => {
        if (!targetUser) return;

        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            axios.defaults.headers.common["x-auth-token"] = token;

            const response = await axios.put(
                `http://localhost:8182/users/${targetUser._id}`,
                data
            );

            if (response.status === 200) {
                toast.success("User updated successfully", { autoClose: 2000 });
                if (targetUser._id === user?._id) {
                    await autoLogIn();
                }
                navigate(-1);
            }

        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Something went wrong", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-white py-4 dark:bg-slate-600">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </main>
        );
    }

    if (!targetUser) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-white py-4 dark:bg-slate-600">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </main>
        );
    }

    return (
        <div className="formPageDiv">
            <div className="formSecondDiv">
                <div className="formTitleDiv">
                    <h1>
                        Edit {targetUser.name.first} {targetUser.name.last}'s Profile
                    </h1>
                    <p>
                        Update the user details below
                    </p>
                </div>

                <Card className="formCard">
                    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">

                        {/* NAME */}
                        <fieldset className="space-y-3">
                            <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Name:
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="firstName" value="First Name" />
                                    <TextInput id="firstName" {...register("name.first")} />
                                    {errors.name?.first && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.first.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="middleName" value="Middle Name" />
                                    <TextInput id="middleName" {...register("name.middle")} />
                                    {errors.name?.middle && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.middle.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="lastName" value="Last Name" />
                                    <TextInput id="lastName" {...register("name.last")} />
                                    {errors.name?.last && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.last.message}</p>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* PHONE */}
                        <div>
                            <Label htmlFor="phone" value="Phone Number" />
                            <TextInput id="phone" type="number" {...register("phone")} />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* IMAGE */}
                        <fieldset className="space-y-3">
                            <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Image:
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="imageUrl" value="Image URL" />
                                    <TextInput id="imageUrl" {...register("image.url")} />
                                    {errors.image?.url && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image.url.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="imageAlt" value="Image Alt Text" />
                                    <TextInput id="imageAlt" {...register("image.alt")} />
                                    {errors.image?.alt && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image.alt.message}</p>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* ADDRESS */}
                        <fieldset className="space-y-3">
                            <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Address:
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="state" value="State" />
                                    <TextInput id="state" {...register("address.state")} />
                                    {errors.address?.state && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="country" value="Country" />
                                    <TextInput id="country" {...register("address.country")} />
                                    {errors.address?.country && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.country.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="city" value="City" />
                                    <TextInput id="city" {...register("address.city")} />
                                    {errors.address?.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="street" value="Street" />
                                    <TextInput id="street" {...register("address.street")} />
                                    {errors.address?.street && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="houseNumber" value="House Number" />
                                    <TextInput id="houseNumber" type="number" {...register("address.houseNumber")} />
                                    {errors.address?.houseNumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.houseNumber.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="zip" value="ZIP Code" />
                                    <TextInput id="zip" type="number" {...register("address.zip")} />
                                    {errors.address?.zip && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.zip.message}</p>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* BUTTONS */}
                        <div className="buttonsDiv">
                            <Button
                                type="submit"
                                color="blue"
                                className="flex-1"
                                disabled={!isValid || loading}
                            >
                                {loading ? "Updating..." : "Update User"}
                            </Button>

                            <Button
                                type="button"
                                color="gray"
                                className="flex-1"
                                onClick={() => navigate(-1)}
                                disabled={loading}
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
