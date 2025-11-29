import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootState } from '../store/store';
import { TCartItem } from '../types/types';
import { cartActions } from '../store/cartSlice';

const useCartRestore = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart && savedCart !== '[]') {
                const cartData: TCartItem[] = JSON.parse(savedCart);
                dispatch(cartActions.loadCartFromStorage(cartData));
            }
        } catch (error) {
            console.error('Failed to restore cart from localStorage:', error);
        }
    }, [dispatch]);
};


const useCartSync = () => {
    const cartItems = useSelector((state: TRootState) => state.cartSlice.items);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);
};

export { useCartSync, useCartRestore };