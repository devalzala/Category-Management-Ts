import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { deleteCategory, getCategories } from "../features/CategorySlice";
import AddCategoryModal from "../components/Modal/AddCategoryModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Category {
    _id: string;
    name: string;
    parentCategory?: { name: string };
    status: string;
}

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { categories } = useSelector((state: RootState) => state.categoryData);

    const [open, setOpen] = useState<boolean>(false);
    const [operationMode, setOperationMode] = useState<string>("add");
    const [id, setId] = useState<string>("");

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const handleModal = (mode: string, dataId: string = "") => {
        setOpen(true);
        setOperationMode(mode);
        setId(dataId);
    };

    const handleDelete = async (id: string) => {
        const response = await dispatch(deleteCategory({ id }));

        toast(response && response.payload && response.payload.message);
        if (response && response.payload && response.payload.success) dispatch(getCategories());
    };

    const columns: GridColDef[] = [
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: ({ row }: { row: Category }) => (
                <Box sx={{ display: "flex", gap: "1rem", mt: "0.5rem" }}>
                    <Button variant="outlined" onClick={() => handleModal("edit", row._id)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(row._id)}>Delete</Button>
                </Box>
            ),
        },
        { field: "name", headerName: "Name", width: 250 },
        {
            field: "parentCategory",
            headerName: "Parent Category",
            width: 250,
            renderCell: ({ row }: { row: Category }) => <p>{row?.parentCategory?.name || "-"}</p>,
        },
        { field: "status", headerName: "Status", width: 250 },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Box sx={{ mx: 3, mt: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button variant="outlined" onClick={() => handleModal("add")} sx={{ pe: 3 }}>Add Category</Button>
            </Box>
            <Box>
                <DataGrid
                    rows={categories || []}
                    columns={columns}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    pageSizeOptions={[5]}
                    getRowId={(row) => row._id}
                />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="outlined" color="error" onClick={handleLogout} sx={{ pe: 3 }}>Logout</Button>
            </Box>
            <AddCategoryModal
                open={open}
                setOpen={setOpen}
                operationMode={operationMode}
                id={id}
                setOperationMode={setOperationMode}
                callApi={() => dispatch(getCategories())}
            />
        </Box>
    );
};

export default Home;