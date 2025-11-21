import { joiResolver } from "@hookform/resolvers/joi";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { registerSchema } from "../validations/register.joi";
import axios from "axios";
import { TUserFormData } from "../types/formData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isValid },
    } = useForm<TUserFormData>({
        defaultValues: {
            name: {
                first: "",
                middle: "",
                last: ""
            },
            phone: 0,
            email: "",
            password: "",
            image: {
                url: "",
                alt: ""
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
        resolver: joiResolver(registerSchema),
    });

    const submitForm = async (data: TUserFormData) => {
        try {
            const response = await axios.post(
                "http://localhost:8182/users", data);

            if (response.status === 200) {
                toast.success("you have registered successfully", { autoClose: 2000, });
                navigate('/signin');
            }

        } catch (error) {
            console.log("Error registering:", error);
            toast.error("something went wrong", { autoClose: 2000, });
        }
    };


    return (
        <div className="pageDiv">
            <div className="formSecondDiv">

                {/* Title */}
                <div className="formTitleDiv">
                    <h1>Register</h1>
                    <p>Create your new account</p>
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
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <Label htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" {...register("email")} />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <Label htmlFor="password" value="Password" />
                            <TextInput id="password" type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
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
                        <div id="buttonsDiv">
                            <Button
                                type="submit"
                                color="blue"
                                className="flex-1"
                                disabled={!isValid}
                            >
                                Submit
                            </Button>

                            <Button
                                type="button"
                                color="gray"
                                className="flex-1"
                                onClick={() => navigate(-1)}
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