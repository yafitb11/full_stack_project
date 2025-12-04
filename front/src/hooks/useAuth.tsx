import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../store/store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { userActions } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const user = useSelector((state: TRootState) => state.userSlice.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const autoLogIn = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const parsedToken = jwtDecode(token) as {
                _id: string;
            };
            axios.defaults.headers.common["x-auth-token"] = token;
            try {
                const response = await axios.get(
                    "http://localhost:8182/users/" +
                    parsedToken._id,
                );

                dispatch(userActions.login(response.data));

            } catch (error) {
                console.log("error in autoLogin:", error);
            }
        }
    }


    const login = async (form: { email: string, password: string }) => {
        try {
            const token = await axios.post(
                "http://localhost:8182/users/login",
                form,
            );
            localStorage.setItem("token", token.data);

            autoLogIn();
            toast.success("Sign In Succseeded", { autoClose: 2000, });
            navigate('/');

        } catch (error) {
            console.log("error in full signIn:", error);
            toast.error("Sign In Failed,check your contuct details!", { autoClose: 2000, });
        }
    };

    return { user, autoLogIn, login }
};

export default useAuth;