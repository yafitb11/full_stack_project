import { joiResolver } from "@hookform/resolvers/joi";
import { Button, FloatingLabel } from "flowbite-react";
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


    return (<div className="flex min-h-[87vh] flex-col items-center justify-center bg-white dark:bg-slate-600">
        <form className="myform sm:!w-[65%] md:!w-[40%] lg:!w-[38%] xl:!w-[36%]" onSubmit={handleSubmit(login)} >
            <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
            <FloatingLabel
                type="email"
                variant="outlined"
                label="Email"
                {...register("email")}
                color={errors["email"] ? "error" : "success"}
            />
            <span className="text-sm text-red-600">{errors["email"]?.message}</span>

            <FloatingLabel
                type="password"
                variant="outlined"
                label="Password"
                {...register("password")}
                color={errors["password"] ? "error" : "success"}
            />
            <span className="text-sm text-red-600">
                {errors["password"]?.message}
            </span>

            <Button type="submit" disabled={!isValid}>
                Sign In
            </Button>
        </form>
    </div>
    );
}

