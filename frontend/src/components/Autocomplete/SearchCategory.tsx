import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, FormControl, TextField, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { searchCategory } from "../../features/CategorySlice";
import { AppDispatch } from "../../store/Store";

interface CategoryOption {
  label: string;
  value: string;
}

interface SearchCategoryProps {
  open: boolean;
  orgById?: string;
  setParentCategory: (category: CategoryOption | null) => void;
  size?: "small" | "medium";
}

const SearchCategory: React.FC<SearchCategoryProps> = ({ open, orgById, setParentCategory, size }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryInputValue, setCategoryInputValue] = useState<string>("");

  // Debounced function for fetching data
  const categoryFetchOptions = useMemo(
    () =>
      _.debounce(async (query: string) => {
        setLoading(true);

        try {
          const response = await dispatch(searchCategory({ search: query }));
          setCategoryOptions(
            response?.payload?.data?.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item._id,
            })) || []
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (open) {
      categoryFetchOptions(categoryInputValue);
    }
  }, [open, categoryInputValue, categoryFetchOptions]);

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        options={categoryOptions}
        getOptionLabel={(option) => option.label}
        loading={loading}
        size={size}
        onChange={(e, newValue) => setParentCategory(newValue)}
        onInputChange={(event, newInputValue) => setCategoryInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Category"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default SearchCategory;