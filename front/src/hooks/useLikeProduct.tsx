import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "./useAuth";

const useLikeProduct = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("token");

    const toggleLike = async (productId: string, isLiked: boolean): Promise<boolean | null> => {
        if (!user) {
            toast.error("Please login to like products", { autoClose: 2000 });
            return null;
        }

        try {
            axios.defaults.headers.common["x-auth-token"] = token;
            await axios.patch(`http://localhost:8182/products/${productId}`);

            const newLikedState = !isLiked;

            toast.success(
                newLikedState ? "Product liked successfully" : "Product unliked successfully",
                { autoClose: 2000 }
            );

            return newLikedState;
        } catch (error) {
            console.error("Error liking/unliking product:", error);
            toast.error("Something went wrong", { autoClose: 2000 });
            return null;
        }
    };

    return { toggleLike };
};

export default useLikeProduct;
