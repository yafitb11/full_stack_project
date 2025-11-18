import axios from "axios";
import { toast } from "react-toastify";

const deleteProduct = async (productId: string) => {

    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this product?")) {
        return false;
    }
    try {
        axios.defaults.headers.common["x-auth-token"] = token;
        await axios.delete(`http://localhost:8182/products/${productId}`);
        toast.success("Product deleted successfully", { autoClose: 2000 });
        return true;
    } catch (error) {
        console.log("Error deleting product:", error);
        toast.error("Failed to delete product", { autoClose: 2000 });
        return false;
    }

};

export default deleteProduct;