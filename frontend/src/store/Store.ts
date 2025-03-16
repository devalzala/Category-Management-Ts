import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/AuthSlice";
import categorySlice from "../features/CategorySlice";

const store = configureStore({
    reducer: {
        authData: authSlice,
        categoryData: categorySlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;