import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCartItem, TProduct } from "../types/types";
import { CartState } from "../types/moreTypes";

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<TProduct>) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item.product._id === product._id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product, quantity: 1 });
            }

            // Update totals
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.product._id !== productId);

            // Update totals
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        },

        updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.product._id === productId);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.product._id !== productId);
                } else {
                    item.quantity = quantity;
                }

                // Update totals
                state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
                state.totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },

        loadCartFromStorage: (state, action: PayloadAction<TCartItem[]>) => {
            state.items = action.payload;
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
