import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { toast } from "react-toastify";
import { cartActions } from "../store/cartSlice";
import { TProduct } from "../types/types";

const useAddToCart = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: TRootState) => state.userSlice.user);
    const cartItems = useSelector((state: TRootState) => state.cartSlice.items);

    const addToCart = (product: TProduct) => {
        if (!user) {
            toast.error("Please login to add products to cart", { autoClose: 2000 });
            return;
        }

        if (user.isAdmin) {
            toast.error("Admins cannot add products to cart", { autoClose: 2000 });
            return;
        }

        const existingItem = cartItems.find(item => item.product._id === product._id);

        if (existingItem) {
            toast.success(`Updated quantity for ${product.title}`, { autoClose: 2000 });
        } else {
            toast.success(`${product.title} added to cart`, { autoClose: 2000 });
        }

        dispatch(cartActions.addToCart(product));
    };

    const removeFromCart = (productId: string) => {
        dispatch(cartActions.removeFromCart(productId));
        toast.success("Product removed from cart", { autoClose: 2000 });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        dispatch(cartActions.updateQuantity({ productId, quantity }));
    };

    const clearCart = () => {
        dispatch(cartActions.clearCart());
        toast.success("Cart cleared", { autoClose: 2000 });
    };

    return {
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItems,
        totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    };
};

export default useAddToCart;