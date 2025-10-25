import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import { editUserSchema } from "../validations/editUser.joi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tuser } from "../types/userType";
import useAuth from "../hooks/useAuth";

export default function EditUser() {
    const { user, autoLogIn } = useAuth();
    { !user && autoLogIn(); }
    const [user1, setUser1] = useState<Tuser>();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${id}`,
                );

                setUser1(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, [id]);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<Tuser>({
        mode: "onChange", resolver: joiResolver(editUserSchema),
    });

    useEffect(() => {
        if (user1) {
            reset({
                name: {
                    first: user1.name.first,
                    middle: user1.name.middle,
                    last: user1.name.last,
                },
                phone: user1.phone,
                image: {
                    url: user1.image.url,
                    alt: user1.image.alt,
                },
                address: {
                    state: user1.address.state !== "not defined" ? user1.address.state : "",
                    country: user1.address.country,
                    city: user1.address.city,
                    street: user1.address.street,
                    houseNumber: user1.address.houseNumber,
                    zip: user1.address.zip,
                },
            });
        }
    }, [user1, reset]);

    const submitForm = async (data: Tuser) => {
        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;
            const response = await axios.put(
                `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${user1?._id}`, data);

            if (response.status === 200) {
                toast.success("editing was successful", { autoClose: 2000, });
                navigate('/manage-users');
            }

        } catch (error) {
            console.log("Error editing user:", error);
            toast.error("something went wrong", { autoClose: 2000, });
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white py-4 dark:bg-slate-600">

            <form onSubmit={handleSubmit(submitForm)} className="myform">
                <h1 className="text-2xl font-bold text-gray-800">Edit User's Details</h1>

                <fieldset className="flex gap-3 justify-center" >
                    <legend className="mb-1" style={{ color: "#057A55" }}>Name</legend>
                    <div>
                        <FloatingLabel {...register("name.first")} variant="outlined" label="First Name" type="text" color={errors.name?.first ? "error" : "success"} />
                        {errors.name?.first && (
                            <p>{errors.name.first.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel {...register("name.middle")} variant="outlined" label="Middle Name" type="text" color={errors.name?.middle ? "error" : "success"} />
                        {errors.name?.middle && (
                            <p>{errors.name.middle.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel {...register("name.last")} variant="outlined" label="Last Name"
                            type="text" color={errors.name?.last ? "error" : "success"} />
                        {errors.name?.last && (
                            <p>{errors.name.last.message}</p>
                        )}
                    </div>
                </fieldset>


                <FloatingLabel  {...register("phone")} variant="outlined" label="Phone" type="number" color={errors.phone ? "error" : "success"}
                />
                {errors.phone && (
                    <p>{errors.phone.message}</p>
                )}


                <fieldset className="flex gap-3 justify-center">
                    <legend className="mb-1" style={{ color: "#057A55" }}>Image</legend>
                    <div>
                        <FloatingLabel {...register("image.url")} variant="outlined" label="url"
                            type="text" color={errors.image?.url ? "error" : "success"} />
                        {errors.image?.url && (
                            <p>{errors.image.url.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel  {...register("image.alt")} variant="outlined" label="alt"
                            type="text" color={errors.image?.alt ? "error" : "success"} />
                        {errors.image?.alt && (
                            <p>{errors.image.alt.message}</p>
                        )}
                    </div>
                </fieldset>


                <fieldset className="flex gap-3 flex-wrap justify-center">
                    <legend className="mb-1" style={{ color: "#057A55" }}>Address</legend>
                    <div>
                        <FloatingLabel   {...register("address.state")} variant="outlined" label="state"
                            type="text" color={errors.address?.state ? "error" : "success"} />
                        {errors.address?.state && (
                            <p>{errors.address.state.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel {...register("address.country")} variant="outlined" label="country"
                            type="text" color={errors.address?.country ? "error" : "success"} />
                        {errors.address?.country && (
                            <p>{errors.address.country.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel  {...register("address.city")} variant="outlined" label="city"
                            type="text" color={errors.address?.city ? "error" : "success"}
                        />
                        {errors.address?.city && (
                            <p>{errors.address.city.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel   {...register("address.street")} variant="outlined" label="street"
                            type="text" color={errors.address?.street ? "error" : "success"} />
                        {errors.address?.street && (
                            <p>{errors.address.street.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel {...register("address.houseNumber")} variant="outlined" label="houseNumber" type="text"
                            color={errors.address?.houseNumber ? "error" : "success"} />
                        {errors.address?.houseNumber && (
                            <p>{errors.address.houseNumber.message}</p>
                        )}
                    </div>
                    <div>
                        <FloatingLabel {...register("address.zip")} variant="outlined" label="zip"
                            type="text" color={errors.address?.zip ? "error" : "success"} />
                        {errors.address?.zip && (
                            <p>{errors.address.zip.message}</p>
                        )}
                    </div>
                </fieldset>

                <Button type="submit" className="w-full" disabled={!isValid}>
                    Submit
                </Button>
            </form>
        </main>
    );
}

