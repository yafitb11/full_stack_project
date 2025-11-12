import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TRootState } from '../store/store';

const useCartSync = () => {
    const cartItems = useSelector((state: TRootState) => state.cartSlice.items);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);
};

export default useCartSync;