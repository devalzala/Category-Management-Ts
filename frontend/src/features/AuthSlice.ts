import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
    auth: any | null;
    loading: boolean;
    error: string | null;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const login = createAsyncThunk(
    "auth/login",
    async (data: LoginData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/auth/login`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/auth/register`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Register failed");
        }
    }
);

const initialState: AuthState = {
    auth: null,
    loading: false,
    error: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.auth = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.auth = action.payload;
                state.error = null;
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;