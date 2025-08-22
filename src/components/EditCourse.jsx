import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCourseStore } from "../store/course.slice"; // adjust path
import { toast } from "react-hot-toast";

// Zod validation schema for courses
const editCourseSchema = z.object({
  courseId: z.string().min(5, "Course ID must be at least 5 characters"),
  courseName: z.string().min(3, "Course name is required"),
  courseShortName: z.string().min(2, "Short name required"),
  credits: z.coerce.number().min(1).max(10),
  isLab: z.boolean(),
});

const EditCourse = ({ open, onClose }) => {
  const { updateCourse, isLoading, selectedCourse } = useCourseStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      courseId: "",
      courseName: "",
      courseShortName: "",
      credits: 0,
      isLab: false,
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (selectedCourse) {
      reset({
        courseId: selectedCourse.courseId || "",
        courseName: selectedCourse.courseName || "",
        courseShortName: selectedCourse.courseShortName || "",
        credits: Number(selectedCourse.credits) || 0,
        isLab: Boolean(selectedCourse.isLab) || false,
      });
    }
  }, [selectedCourse, reset]);

  const onSubmit = async (data) => {
    if (!selectedCourse) return;

    const payload = {
      ...data,
      id: selectedCourse._id, // important for update
    };

    await toast
      .promise(updateCourse(payload), {
        loading: "Updating course...",
        success: (res) => {
          if (res?.success) return res.message || "Course updated!";
          throw new Error(res?.message || "Failed to update course.");
        },
        error: (err) => err.message || "Failed to update course.",
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

  if (!selectedCourse) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <DialogTitle>Edit Course</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Controller
              name="courseId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Course ID"
                  error={!!errors.courseId}
                  helperText={errors.courseId?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="courseName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Course Name"
                  error={!!errors.courseName}
                  helperText={errors.courseName?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="courseShortName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Short Name"
                  error={!!errors.courseShortName}
                  helperText={errors.courseShortName?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="credits"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Credits"
                  error={!!errors.credits}
                  helperText={errors.credits?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="isLab"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Is Lab"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Course"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCourse;
