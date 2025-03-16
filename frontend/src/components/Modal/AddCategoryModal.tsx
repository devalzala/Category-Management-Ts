import React, { useEffect, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchCategory from "../Autocomplete/SearchCategory";
import { createCategory, getCategoryById, updateCategory } from "../../features/CategorySlice";
import { AppDispatch, RootState } from "../../store/Store";

interface StatusOption {
    label: string;
    value: string;
}

interface AddCategoryModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    operationMode: string;
    id: string;
    setOperationMode: (mode: string) => void;
    callApi: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, setOpen, operationMode, id, setOperationMode, callApi }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { category } = useSelector((state: RootState) => state.categoryData);

    const [name, setName] = useState<string>("");
    const [status, setStatus] = useState<StatusOption | null>(null);
    const [parentCategory, setParentCategory] = useState<{ value: string } | null>(null);

    const statusOptions: StatusOption[] = [
        { label: "Active", value: "active" },
        { label: "In-Active", value: "inactive" }
    ];

    useEffect(() => {
        if (operationMode === "edit" && id) dispatch(getCategoryById({ id }));
    }, [operationMode, id, dispatch]);

    useEffect(() => {
        if (operationMode === "edit" && category) {
            setName(category.name || "");
            setStatus(statusOptions.find(item => item.value === category.status) || null);
        }
    }, [operationMode, category]);

    const handleClose = () => {
        setOpen(false);
        setName("");
        setStatus(null);
        setParentCategory(null);
        setOperationMode("add");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return toast("Please enter a name");

        const finalData = { name, status: status?.value || "" };
        const response = await dispatch(
            operationMode === "add"
                ? createCategory({ ...finalData, parentCategory: parentCategory?.value })
                : updateCategory({ ...finalData, id })
        );

        toast(response && response.payload && response.payload.message);
        if (response && response.payload && response.payload.success) {
            callApi();
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{operationMode === "add" ? "Add" : "Edit"} Category</DialogTitle>
            <DialogContent>
                {operationMode === "add" && <SearchCategory open={open} setParentCategory={setParentCategory} />}
                <TextField
                    required
                    margin="dense"
                    label="Name"
                    type="text"
                    value={name}
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
                <Autocomplete
                    disablePortal
                    options={statusOptions}
                    value={status}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} label="Status" />}
                    onChange={(e, newValue) => setStatus(newValue)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCategoryModal;