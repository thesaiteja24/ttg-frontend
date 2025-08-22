import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCourseStore } from "../store/course.slice";
import { toast } from "react-hot-toast";
import { useYearSemesterStore } from "../store/yearsemester.slice";
import { useEffect } from "react";

// ✅ Zod schema based on your payload
const createCourseSchema = z.object({
  yearSemesterId: z.uuidv4("Invalid Year-Semester ID"),
  courseId: z.string().min(3, "Course ID is required"),
  courseName: z.string().min(3, "Course name is required"),
  courseShortName: z.string().min(2, "Short name is required"),
  credits: z
    .number()
    .min(1, "Credits must be at least 1")
    .max(10, "Max 10 credits"),
  isLab: z.boolean(),
});

const CreateCourse = ({ open, onClose }) => {
  const { createCourse, isLoading } = useCourseStore();
  const { yearSemesters, getYearSemesters, yearSemestersList } =
    useYearSemesterStore();

  useEffect(() => {
    if (yearSemesters.length === 0) getYearSemesters(true);
    console.log("year-semesters List", yearSemestersList);
  }, [getYearSemesters]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      yearSemesterId: "",
      courseId: "",
      courseName: "",
      courseShortName: "",
      credits: 3,
      isLab: false,
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      credits: Number(data.credits),
    };

    await toast
      .promise(createCourse(payload), {
        loading: "Adding course...",
        success: (res) => {
          if (res?.success) return res.message || "Course added successfully!";
          throw new Error(res?.message || "Failed to add course.");
        },
        error: (err) => err.message || "Failed to create course.",
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
      <DialogTitle>Add New Course</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {/* Year-Semester Dropdown */}
            <Controller
              name="yearSemesterId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Year-Semester"
                  error={!!errors.yearSemesterId}
                  helperText={errors.yearSemesterId?.message}
                  fullWidth
                >
                  {yearSemesters.map((ys) => (
                    <MenuItem key={ys._id} value={ys._id}>
                      {`Year ${ys.year} - Semester ${ys.semester}`}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* Course ID */}
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

            {/* Course Name */}
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

            {/* Short Name */}
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

            {/* Credits */}
            <Controller
              name="credits"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Credits"
                  type="number"
                  error={!!errors.credits}
                  helperText={errors.credits?.message}
                  fullWidth
                />
              )}
            />

            {/* Is Lab */}
            <Controller
              name="isLab"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Is Lab Course?"
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
              "Add Course"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCourse;
