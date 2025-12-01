import { joiResolver } from "@hookform/resolvers/joi";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { SignInJoiSchema } from "../validations/SigninSchema.joi";
import useAuth from "../hooks/useAuth";


export default function SignIn() {

    const initialFormData = {
        email: "",
        password: "",
    };

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: initialFormData,
        mode: "onChange",
        resolver: joiResolver(SignInJoiSchema),
    });

    const { login } = useAuth();


    return (
        <div className="pageDiv">
            <div className="max-w-[32rem] mx-auto">

                {/* Title */}
                <div className="pageTextAndButtonsDiv">
                    <h1>Sign In</h1>
                    <p>Access your account</p>
                </div>

                <Card className="formCard">
                    <form onSubmit={handleSubmit(login)} className="space-y-6">

                        {/* EMAIL */}
                        <div>
                            <Label htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <Label htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* BUTTONS */}
                        <div className="buttonsDiv">
                            <Button
                                type="submit"
                                disabled={!isValid}
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );

}

