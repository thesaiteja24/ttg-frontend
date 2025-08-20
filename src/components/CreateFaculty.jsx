import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFacultyStore } from "../store/faculty.slice";
import { toast } from "react-hot-toast";

// Zod validation schema
const createFacultySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  countryCode: z
    .string()
    .min(1, "Country code must be at least 1 digit")
    .max(3, "Country code must not exceed 3 digits")
    .default("91"),
  phone: z
    .string()
    .refine((val) => val.length === 10, "Phone number must be 10 digits"),
});

const CreateFaculty = ({ open, onClose }) => {
  const { addFaculty, isLoading } = useFacultyStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFacultySchema),
    defaultValues: {
      name: "",
      countryCode: "91",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      phone: Number(data.phone),
      countryCode: Number(data.countryCode),
    };

    await toast
      .promise(addFaculty(payload), {
        loading: "Adding faculty...",
        success: (res) => {
          if (res?.success) return res.message || "Faculty added successfully!";
          throw new Error(res?.message || "Failed to add faculty.");
        },
        error: (err) => err.message || "Failed to create faculty.",
      })
      .then((response) => {
        if (response.success) {
          reset();
          onClose();
        }
      });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Faculty</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            <Box display="flex" gap={2}>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country Code"
                    error={!!errors.countryCode}
                    helperText={errors.countryCode?.message}
                    sx={{ width: "30%" }}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                  />
                )}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Faculty"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateFaculty;
