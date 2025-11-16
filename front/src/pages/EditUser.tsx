import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import { editUserSchema } from "../validations/editUser.joi";
import axios from "axios";
import { FormData } from "../types/formData";
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

    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormData>({
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
                    state: targetUser.address.state !== "not defined" ? targetUser.address.state : "",
                    country: targetUser.address.country,
                    city: targetUser.address.city,
                    street: targetUser.address.street,
                    houseNumber: targetUser.address.houseNumber,
                    zip: targetUser.address.zip,
                },
            });
        }
    }, [targetUser, reset]);


    const submitForm = async (data: FormData) => {
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
        <main className="flex min-h-screen flex-col items-center justify-center bg-white py-4 dark:bg-slate-600">
            <form onSubmit={handleSubmit(submitForm)} className="myform">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Edit {targetUser.name.first} {targetUser.name.last}'s Profile
                </h1>

                <fieldset className="flex gap-3 justify-center">
                    <legend className="mb-1" style={{ color: "#057A55" }}>Name</legend>
                    <div>
                        <FloatingLabel
                            {...register("name.first")}
                            variant="outlined"
                            label="First Name"
                            type="text"
                            color={errors.name?.first ? "error" : "success"}
                        />
                        {errors.name?.first && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.first.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("name.middle")}
                            variant="outlined"
                            label="Middle Name"
                            type="text"
                            color={errors.name?.middle ? "error" : "success"}
                        />
                        {errors.name?.middle && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.middle.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("name.last")}
                            variant="outlined"
                            label="Last Name"
                            type="text"
                            color={errors.name?.last ? "error" : "success"}
                        />
                        {errors.name?.last && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.last.message}</p>
                        )}
                    </div>
                </fieldset>

                <FloatingLabel
                    {...register("phone")}
                    variant="outlined"
                    label="Phone"
                    type="number"
                    color={errors.phone ? "error" : "success"}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}

                <fieldset className="flex gap-3 justify-center">
                    <legend className="mb-1" style={{ color: "#057A55" }}>Image</legend>
                    <div>
                        <FloatingLabel
                            {...register("image.url")}
                            variant="outlined"
                            label="Image URL"
                            type="text"
                            color={errors.image?.url ? "error" : "success"}
                        />
                        {errors.image?.url && (
                            <p className="text-red-500 text-sm mt-1">{errors.image.url.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("image.alt")}
                            variant="outlined"
                            label="Image Alt Text"
                            type="text"
                            color={errors.image?.alt ? "error" : "success"}
                        />
                        {errors.image?.alt && (
                            <p className="text-red-500 text-sm mt-1">{errors.image.alt.message}</p>
                        )}
                    </div>
                </fieldset>

                <fieldset className="flex gap-3 flex-wrap justify-center">
                    <legend className="mb-1" style={{ color: "#057A55" }}>Address</legend>
                    <div>
                        <FloatingLabel
                            {...register("address.state")}
                            variant="outlined"
                            label="State"
                            type="text"
                            color={errors.address?.state ? "error" : "success"}
                        />
                        {errors.address?.state && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("address.country")}
                            variant="outlined"
                            label="Country"
                            type="text"
                            color={errors.address?.country ? "error" : "success"}
                        />
                        {errors.address?.country && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.country.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("address.city")}
                            variant="outlined"
                            label="City"
                            type="text"
                            color={errors.address?.city ? "error" : "success"}
                        />
                        {errors.address?.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("address.street")}
                            variant="outlined"
                            label="Street"
                            type="text"
                            color={errors.address?.street ? "error" : "success"}
                        />
                        {errors.address?.street && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("address.houseNumber")}
                            variant="outlined"
                            label="House Number"
                            type="number"
                            color={errors.address?.houseNumber ? "error" : "success"}
                        />
                        {errors.address?.houseNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.houseNumber.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel
                            {...register("address.zip")}
                            variant="outlined"
                            label="ZIP Code"
                            type="number"
                            color={errors.address?.zip ? "error" : "success"}
                        />
                        {errors.address?.zip && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.zip.message}</p>
                        )}
                    </div>
                </fieldset>

                <div className="flex gap-4 mt-6">
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={!isValid || loading}
                        color="blue"
                    >
                        {loading ? "Updating..." : "Update User"}
                    </Button>
                    <Button
                        type="button"
                        color="gray"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </main>
    );
}
