// components/EditAssignment.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAssignmentStore } from "../store/assignment.slice";
import { useCourseStore } from "../store/course.slice";
import { useYearSemesterStore } from "../store/yearsemester.slice";
import { useFacultyStore } from "../store/faculty.slice";

const EditAssignment = ({ open, onClose, yearSemesterFilter }) => {
  const { selectedAssignment, updateAssignment, isLoading } =
    useAssignmentStore();
  const { courseList } = useCourseStore();
  const { classesList } = useYearSemesterStore(); // you keep classes here
  const { facultyList } = useFacultyStore();

  const [form, setForm] = useState({
    courseId: "",
    facultyId: "",
    classId: "",
  });

  // normalize YS id from the selected assignment
  const ysId = useMemo(() => {
    if (!selectedAssignment) return null;
    // Depending on your aggregation, this might be yearSemesterId (string) or yearSemester object
    return (
      selectedAssignment?.course?.yearSemesterId?._id ??
      selectedAssignment?.course?.yearSemesterId ??
      selectedAssignment?.course?.yearSemester?._id ??
      null
    );
  }, [selectedAssignment]);

  // limit options to the assignment’s YS (change if you want cross-YS editing)
  const editCourses = useMemo(() => {
    if (!ysId) return [];
    return courseList.filter(
      (c) => (c?.yearSemesterId?._id ?? c?.yearSemesterId) === ysId
    );
  }, [ysId, courseList]);

  const editClasses = useMemo(() => {
    if (!ysId) return [];
    return classesList.filter(
      (cl) => (cl?.yearSemesterId?._id ?? cl?.yearSemesterId) === ysId
    );
  }, [ysId, classesList]);

  useEffect(() => {
    if (!selectedAssignment) return;
    setForm({
      courseId: selectedAssignment?.course?._id || "",
      facultyId: selectedAssignment?.faculty?._id || "",
      classId: selectedAssignment?.class?._id || "",
    });
  }, [selectedAssignment]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!selectedAssignment) return;
    if (!form.courseId || !form.facultyId || !form.classId) {
      toast.error("Please select all fields");
      return;
    }

    await toast
      .promise(updateAssignment({ _id: selectedAssignment._id, ...form }), {
        loading: "Updating assignment...",
        success: (res) => {
          if (res?.success) return res.message || "Assignment updated!";
          throw new Error(res?.message || "Failed to update assignment.");
        },
        error: (err) => err.message || "Failed to update assignment.",
      })
      .then((resp) => {
        if (resp?.success) onClose();
      });
  };

  if (!selectedAssignment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <DialogTitle>Edit Assignment</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box display="grid" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Course</InputLabel>
            <Select
              name="courseId"
              label="Course"
              value={form.courseId}
              onChange={handleChange}
            >
              {editCourses.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Faculty</InputLabel>
            <Select
              name="facultyId"
              label="Faculty"
              value={form.facultyId}
              onChange={handleChange}
            >
              {facultyList.map((f) => (
                <MenuItem key={f._id} value={f._id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Class</InputLabel>
            <Select
              name="classId"
              label="Class"
              value={form.classId}
              onChange={handleChange}
            >
              {editClasses.map((cl) => (
                <MenuItem key={cl._id} value={cl._id}>
                  Section {cl.section}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAssignment;
