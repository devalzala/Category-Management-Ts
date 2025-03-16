import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getApisHeaders } from "../utils/utils";
import { RootState } from "../store/Store";

interface Category {
    _id: string;
    name: string;
    status: string;
}

interface CategoryState {
    categories: Category[];
    category: Category | null;
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    category: null,
    loading: false,
    error: null,
};

// Define async thunk actions with proper typings
export const createCategory = createAsyncThunk<
    { success: boolean; message: string },
    { name: string; status: string; parentCategory?: string },
    { rejectValue: { message: string; success: boolean } }
>(
    "category/createCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/category`,
                data,
                getApisHeaders()
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateCategory = createAsyncThunk<
    { success: boolean; message: string },
    { id: string; name: string; status: string },
    { rejectValue: { message: string; success: boolean } }
>(
    "category/updateCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/category/${data.id}`,
                data,
                getApisHeaders()
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteCategory = createAsyncThunk<
    { success: boolean; message: string },
    { id: string },
    { rejectValue: { message: string; success: boolean } }
>(
    "category/deleteCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_API}/category/${data.id}`,
                getApisHeaders()
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getCategories = createAsyncThunk<
    { data: Category[] },
    void,
    { rejectValue: { message: string; success: boolean } }
>(
    "category/getCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/category`,
                getApisHeaders()
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getCategoryById = createAsyncThunk<
    { data: Category },
    { id: string },
    { rejectValue: { message: string; success: boolean } }
>(
    "category/getCategoryById",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/category/${data.id}`,
                getApisHeaders()
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const searchCategory = createAsyncThunk<
    { data: Category[] },
    { search: string },
    { rejectValue: { message: string; success: boolean } }
>(
    "category/searchCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/category/searchcategory`,
                data,
                getApisHeaders()
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action: PayloadAction<{ data: Category[] }>) => {
                state.loading = false;
                state.categories = action.payload.data;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch categories";
            })

            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoryById.fulfilled, (state, action: PayloadAction<{ data: Category }>) => {
                state.loading = false;
                state.category = action.payload.data;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch category";
            });
    },
});

export const selectCategories = (state: RootState) => state.categoryData.categories;
export const selectCategory = (state: RootState) => state.categoryData.category;
export const selectLoading = (state: RootState) => state.categoryData.loading;
export const selectError = (state: RootState) => state.categoryData.error;

export default categorySlice.reducer;