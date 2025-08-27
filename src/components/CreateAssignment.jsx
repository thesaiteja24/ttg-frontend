// components/CreateAssignment.jsx
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

import { useYearSemesterStore } from "../store/yearsemester.slice";
import { useCourseStore } from "../store/course.slice";
import { useFacultyStore } from "../store/faculty.slice";
import { useAssignmentStore } from "../store/assignment.slice";

const CreateAssignment = ({ open, onClose, onCreated, pageFilterYS }) => {
  const { yearSemesters, classesList, getYearSemesters, getClasses } =
    useYearSemesterStore();
  const { courseList, getCourses } = useCourseStore();
  const { facultyList, getFaculty } = useFacultyStore();
  const { addAssignment, isLoading } = useAssignmentStore();

  // local form state
  const [ysId, setYsId] = useState("");
  const [form, setForm] = useState({
    courseId: "",
    facultyId: "",
    classId: "",
  });

  // bootstrap refs (in case user opens dialog before page bootstraps)
  useEffect(() => {
    if (!yearSemesters.length) getYearSemesters(true);
    if (!classesList.length) getClasses();
    if (!courseList.length) getCourses();
    if (!facultyList.length) getFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    yearSemesters.length,
    classesList.length,
    courseList.length,
    facultyList.length,
  ]);

  // filter options by selected YS
  const filteredCourses = useMemo(() => {
    if (!ysId) return [];
    return courseList.filter(
      (c) => (c?.yearSemesterId?._id ?? c?.yearSemesterId) === ysId
    );
  }, [ysId, courseList]);

  const filteredClasses = useMemo(() => {
    if (!ysId) return [];
    return classesList.filter(
      (cl) => (cl?.yearSemesterId?._id ?? cl?.yearSemesterId) === ysId
    );
  }, [ysId, classesList]);

  // reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setYsId("");
      setForm({ courseId: "", facultyId: "", classId: "" });
    }
  }, [open]);

  const handleSave = async () => {
    if (!ysId || !form.courseId || !form.facultyId || !form.classId) {
      toast.error("Please select Year-Semester, Course, Faculty, and Class");
      return;
    }

    await toast
      .promise(addAssignment(form), {
        loading: "Creating assignment...",
        success: (res) => {
          if (res?.success) return res.message || "Assignment created!";
          throw new Error(res?.message || "Failed to create assignment.");
        },
        error: (err) => err.message || "Failed to create assignment.",
      })
      .then(async (resp) => {
        if (resp?.success) {
          // Let the parent refresh its list based on *page* filter
          if (onCreated) await onCreated(pageFilterYS);
          onClose();
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <DialogTitle>Create Assignment</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box display="grid" gap={2}>
          {/* Year & Semester */}
          <FormControl fullWidth>
            <InputLabel>Year & Semester</InputLabel>
            <Select
              label="Year & Semester"
              value={ysId}
              onChange={(e) => {
                setYsId(e.target.value);
                setForm({ courseId: "", facultyId: "", classId: "" }); // reset dependent fields
              }}
            >
              {yearSemesters.map((ys) => (
                <MenuItem key={ys._id} value={ys._id}>
                  {`Year ${ys.year} - Sem ${ys.semester}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Course */}
          <FormControl
            fullWidth
            disabled={!ysId}
            sx={{ cursor: !ysId ? "not-allowed" : "default" }}
          >
            <InputLabel>Course</InputLabel>
            <Select
              name="courseId"
              label="Course"
              value={form.courseId}
              onChange={(e) =>
                setForm((p) => ({ ...p, courseId: e.target.value }))
              }
            >
              {filteredCourses.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Faculty */}
          <FormControl
            fullWidth
            disabled={!ysId}
            sx={{ cursor: !ysId ? "not-allowed" : "default" }}
          >
            <InputLabel>Faculty</InputLabel>
            <Select
              name="facultyId"
              label="Faculty"
              value={form.facultyId}
              onChange={(e) =>
                setForm((p) => ({ ...p, facultyId: e.target.value }))
              }
            >
              {facultyList.map((f) => (
                <MenuItem key={f._id} value={f._id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Class */}
          <FormControl
            fullWidth
            disabled={!ysId}
            sx={{ cursor: !ysId ? "not-allowed" : "default" }}
          >
            <InputLabel>Class</InputLabel>
            <Select
              name="classId"
              label="Class"
              value={form.classId}
              onChange={(e) =>
                setForm((p) => ({ ...p, classId: e.target.value }))
              }
            >
              {filteredClasses.map((cl) => (
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
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAssignment;
