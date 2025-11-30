import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from '../store/store';
import { TCartItem } from '../types/types';
import { cartActions } from '../store/cartSlice';
import useAuth from '../hooks/useAuth';


/* ---------------------------------------------------
   Restore cart on login (load from cart_<userId>)
--------------------------------------------------- */
const useCartRestore = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return; // אין משתמש — אין עגלה לטעון

        try {
            const savedCart = localStorage.getItem(`cart_${user._id}`);

            if (savedCart && savedCart !== '[]') {
                const cartData: TCartItem[] = JSON.parse(savedCart);
                dispatch(cartActions.loadCartFromStorage(cartData));
            } else {
                dispatch(cartActions.clearCart()); // עגלה ריקה למשתמש חדש
            }
        } catch (error) {
            console.error('Failed to restore cart:', error);
        }
    }, [user, dispatch]);
};


/* ---------------------------------------------------
   Sync cart to localStorage (save to cart_<userId>)
--------------------------------------------------- */
const useCartSync = () => {
    const cartItems = useSelector((state: TRootState) => state.cartSlice.items);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }, [cartItems, user]);
};


export { useCartSync, useCartRestore };
