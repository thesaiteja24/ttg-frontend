import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Chip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useYearSemesterStore } from "../store/yearSemester.slice";
import { toast } from "react-hot-toast";

// Zod schema
const editYearSemesterSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1, "Year is required")
    .max(4, "Max year is 4"),
  semester: z.coerce
    .number()
    .int()
    .min(1, "Semester is required")
    .max(8, "Max semester is 8"),
  branch: z.string().min(2, "Branch is required"),
  sections: z.array(z.string()).nonempty("At least one section is required"),
});

const EditYearSemester = ({ open, onClose }) => {
  const { updateYearSemester, isLoading, selectedYearSemester } =
    useYearSemesterStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editYearSemesterSchema),
    defaultValues: {
      year: 1,
      semester: 1,
      branch: "",
      sections: [],
    },
  });

  const [sectionInput, setSectionInput] = useState("");
  const [sections, setSections] = useState([]);

  // Prefill data
  useEffect(() => {
    if (selectedYearSemester) {
      reset({
        year: Number(selectedYearSemester.year) || 1,
        semester: Number(selectedYearSemester.semester) || 1,
        branch: selectedYearSemester.branch || "",
        sections: selectedYearSemester.sections || [],
      });
      setSections(selectedYearSemester.sections || []);
    }
  }, [selectedYearSemester, reset]);

  // Add section on Enter
  const handleAddSection = (e) => {
    if (e.key === "Enter" && sectionInput.trim()) {
      e.preventDefault();
      if (!sections.includes(sectionInput.trim())) {
        const updated = [...sections, sectionInput.trim()];
        setSections(updated);
        setValue("sections", updated);
      }
      setSectionInput("");
    }
  };

  // Remove section
  const handleDeleteSection = (sectionToDelete) => {
    const updated = sections.filter((s) => s !== sectionToDelete);
    setSections(updated);
    setValue("sections", updated);
  };

  const onSubmit = async (data) => {
    if (!selectedYearSemester) return;

    const payload = {
      ...data,
      id: selectedYearSemester._id,
    };

    await toast
      .promise(updateYearSemester(payload), {
        loading: "Updating Year & Semester...",
        success: (res) => {
          if (res?.success) return res.message || "Updated successfully!";
          throw new Error(res?.message || "Failed to update.");
        },
        error: (err) => err.message || "Failed to update Year & Semester.",
      })
      .then((response) => {
        if (response.success) {
          reset();
          setSections([]);
          onClose();
        }
      });
  };

  const handleClose = () => {
    reset();
    setSections([]);
    onClose();
  };

  if (!selectedYearSemester) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <DialogTitle>Edit Year & Semester</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {/* Year */}
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Year"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  fullWidth
                />
              )}
            />

            {/* Semester */}
            <Controller
              name="semester"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Semester"
                  error={!!errors.semester}
                  helperText={errors.semester?.message}
                  fullWidth
                />
              )}
            />

            {/* Branch */}
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Branch"
                  error={!!errors.branch}
                  helperText={errors.branch?.message}
                  fullWidth
                />
              )}
            />

            {/* Sections */}
            <Box>
              <Typography variant="subtitle2" mb={1}>
                Sections
              </Typography>
              <TextField
                value={sectionInput}
                onChange={(e) => setSectionInput(e.target.value)}
                onKeyDown={handleAddSection}
                label="Add Section (press Enter)"
                fullWidth
                error={!!errors.sections}
                helperText={errors.sections?.message}
              />
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {sections.map((section, index) => (
                  <Chip
                    key={index}
                    label={section}
                    onDelete={() => handleDeleteSection(section)}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditYearSemester;
