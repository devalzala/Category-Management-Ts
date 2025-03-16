import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDispatch } from "../store/Store";
import { register } from "../features/AuthSlice";

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [fields, setFields] = useState<{ name: string; email: string; password: string }>({
        name: "",
        email: "",
        password: "",
    });

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!fields.name) {
            return toast.warning("Name is required");
        }

        if (!fields.email) {
            return toast.warning("Email is required");
        }

        if (!fields.password) {
            return toast.warning("Password is required");
        }

        const response = await dispatch(register(fields));

        if (response && response.payload) {
            return toast(response.payload.message);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid black",
                padding: 3,
                borderRadius: 2,
                width: 300,
                boxShadow: 3,
                bgcolor: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <Typography variant="h6" mb={2}>Register Here</Typography>
            <TextField
                placeholder="Enter your name"
                name="name"
                type="text"
                fullWidth
                margin="normal"
                value={fields.name}
                onChange={handleChange}
            />
            <TextField
                placeholder="Enter your email"
                name="email"
                type="text"
                fullWidth
                margin="normal"
                value={fields.email}
                onChange={handleChange}
            />
            <TextField
                placeholder="Enter your password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={fields.password}
                onChange={handleChange}
            />
            <Link style={{ textDecoration: "none" }} to="/login">
                Already have an account? <span style={{ fontWeight: "700", textDecoration: "underline" }}>Login Here</span>
            </Link>
            <LoadingButton type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Submit
            </LoadingButton>
        </Box>
    );
};

export default Register;