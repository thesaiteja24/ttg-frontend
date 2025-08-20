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
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFacultyStore } from "../store/faculty.slice";
import { toast } from "react-hot-toast";

// Zod validation schema
const editFacultySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  countryCode: z.string().min(1).max(3).default("91"),
  phone: z
    .string()
    .refine((val) => val.length === 10, "Phone number must be 10 digits"),
});

const EditFaculty = ({ open, onClose }) => {
  const { updateFaculty, isLoading, selectedFaculty } = useFacultyStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editFacultySchema),
    defaultValues: {
      name: "",
      countryCode: "91",
      phone: "",
    },
  });

  // Prefill values when editing
  useEffect(() => {
    if (selectedFaculty) {
      reset({
        name: selectedFaculty.name || "",
        countryCode: String(selectedFaculty.countryCode || "91"),
        phone: String(selectedFaculty.phone || ""),
      });
    }
  }, [selectedFaculty, reset]);

  const onSubmit = async (data) => {
    if (!selectedFaculty) return; // prevent accidental "null" update

    const payload = {
      ...data,
      id: selectedFaculty._id, // required for update
      phone: Number(data.phone),
      countryCode: Number(data.countryCode),
    };

    await toast
      .promise(updateFaculty(payload), {
        loading: "Updating faculty...",
        success: (res) => {
          if (res?.success) return res.message || "Faculty updated!";
          throw new Error(res?.message || "Failed to update faculty.");
        },
        error: (err) => err.message || "Failed to update faculty.",
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

  if (!selectedFaculty) return null; // don’t render if nothing is selected

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <DialogTitle>Edit Faculty</DialogTitle>
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
              "Update Faculty"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditFaculty;
