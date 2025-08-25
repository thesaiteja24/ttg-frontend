import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useYearSemesterStore } from "../store/yearsemester.slice";
import { useCourseStore } from "../store/course.slice";
import { useFacultyStore } from "../store/faculty.slice";
import { useAssignmentStore } from "../store/assignment.slice";

const darkTheme = createTheme({ palette: { mode: "dark" } });
const ALL = "ALL";

const AssignmentManagement = () => {
  // stores
  const { yearSemesters, classesList, getYearSemesters, getClasses } =
    useYearSemesterStore();
  const { courseList, getCourses } = useCourseStore();
  const { facultyList, getFaculty } = useFacultyStore();
  const { assignmentList, getAssignments, addAssignment } =
    useAssignmentStore();

  // bootstrap reference data
  useEffect(() => {
    if (!yearSemesters.length) getYearSemesters(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearSemesters.length]);
  useEffect(() => {
    if (!classesList.length) getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classesList.length]);
  useEffect(() => {
    if (!courseList.length) getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseList.length]);
  useEffect(() => {
    if (!facultyList.length) getFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyList.length]);

  // fetch ALL assignments on mount by default
  useEffect(() => {
    getAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UI state
  const [selectedYS, setSelectedYS] = useState(ALL);
  const [form, setForm] = useState({
    courseId: "",
    facultyId: "",
    classId: "",
  });

  // derived lists for the form (only when a specific YS is selected)
  const filteredCourses = useMemo(() => {
    if (!selectedYS || selectedYS === ALL) return [];
    return courseList.filter((c) => {
      const ys = c?.yearSemesterId?._id ?? c?.yearSemesterId;
      return ys === selectedYS;
    });
  }, [selectedYS, courseList]);

  const filteredClasses = useMemo(() => {
    if (!selectedYS || selectedYS === ALL) return [];
    return classesList.filter((cl) => {
      const ys = cl?.yearSemesterId?._id ?? cl?.yearSemesterId;
      return ys === selectedYS;
    });
  }, [selectedYS, classesList]);

  // handlers
  const handleYSChange = async (value) => {
    setSelectedYS(value);
    // reset form whenever the YS changes
    setForm({ courseId: "", facultyId: "", classId: "" });

    try {
      if (value === ALL) {
        await getAssignments(); // all
      } else {
        await getAssignments(value); // filtered by YS id
      }
    } catch (e) {
      toast.error(e?.message || "Failed to load assignments");
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.courseId || !form.facultyId || !form.classId) {
      toast.error("Please select all fields");
      return;
    }

    await toast.promise(addAssignment(form), {
      loading: "Creating assignment...",
      success: (res) => {
        if (res?.success)
          return res.message || "Assignment added successfully!";
        throw new Error(res?.message || "Failed to add assignment.");
      },
      error: (err) => err.message || "Failed to create assignment.",
    });

    setForm({ courseId: "", facultyId: "", classId: "" });

    // refresh assignments based on current filter
    if (selectedYS === ALL) getAssignments();
    else getAssignments(selectedYS);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            Assignment Management
          </Typography>
        </Box>

        {/* Year-Semester Selector */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Year & Semester</InputLabel>
          <Select
            value={selectedYS}
            onChange={(e) => handleYSChange(e.target.value)}
            label="Year & Semester"
          >
            <MenuItem value={ALL}>All</MenuItem>
            {yearSemesters?.map((ys) => (
              <MenuItem key={ys._id} value={ys._id}>
                {`Year ${ys.year} - Sem ${ys.semester}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Create Assignment Form — only when a specific YS is selected */}
        {selectedYS !== ALL && selectedYS && (
          <Card sx={{ mb: 3 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                >
                  {filteredCourses.map((c) => (
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
                  value={form.classId}
                  onChange={handleChange}
                >
                  {filteredClasses.map((cl) => (
                    <MenuItem key={cl._id} value={cl._id}>
                      Section {cl.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Create Assignment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Assignment Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
          }}
        >
          {assignmentList?.map((a) => (
            <Card key={a._id} variant="outlined">
              <CardHeader title={a?.course?.courseName || "Unknown Course"} />
              <Divider />
              <CardContent sx={{ display: "grid", rowGap: 1 }}>
                <Typography variant="body2">
                  <strong>Faculty:</strong> {a?.faculty?.name}{" "}
                </Typography>
                <Typography variant="body2">
                  <strong>Class:</strong> {a?.class?.section}
                </Typography>
                {/* Show YS for context even when viewing ALL */}
                {a?.course?.yearSemester && (
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Year {a.course.yearSemester.year} -{" "}
                    Sem {a.course.yearSemester.semester}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}

          {(!assignmentList || assignmentList.length === 0) && (
            <Typography variant="body2" sx={{ opacity: 0.8, color: "white" }}>
              No assignments found.
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AssignmentManagement;
