import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import searchSlice from "./searchSlice";
import cartSlice from "./cartSlice";

const store = configureStore({
    reducer: { userSlice, searchSlice, cartSlice },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})

const RootReducer = combineReducers({ userSlice, searchSlice, cartSlice });
export type TRootState = ReturnType<typeof RootReducer>;
export default store;