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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { useYearSemesterStore } from "../store/yearsemester.slice";
import { useCourseStore } from "../store/course.slice";
import { useFacultyStore } from "../store/faculty.slice";
import { useAssignmentStore } from "../store/assignment.slice";

import EditAssignment from "../components/EditAssignment";
import CreateAssignment from "../components/CreateAssignment";
import { Delete, DeleteIcon, EditIcon, Trash2Icon } from "lucide-react";

const darkTheme = createTheme({ palette: { mode: "dark" } });
const ALL = "ALL";

const AssignmentManagement = () => {
  // stores
  const { yearSemesters, classesList, getYearSemesters, getClasses } =
    useYearSemesterStore();
  const { courseList, getCourses } = useCourseStore();
  const { facultyList, getFaculty } = useFacultyStore();
  const {
    assignmentList,
    getAssignments,
    setSelectedAssignment,
    deleteAssignment,
    isLoading,
  } = useAssignmentStore();

  // dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  // filters
  const [selectedYS, setSelectedYS] = useState(ALL);
  const [selectedSection, setSelectedSection] = useState(ALL);

  // bootstrap reference data
  useEffect(() => {
    if (!yearSemesters.length) getYearSemesters(true);
    if (!classesList.length) getClasses();
    if (!courseList.length) getCourses();
    if (!facultyList.length) getFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch ALL assignments on mount
  useEffect(() => {
    getAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived: sections available for the selected YS
  const availableSections = useMemo(() => {
    if (!selectedYS || selectedYS === ALL) return [];
    const sections = classesList
      .filter(
        (cl) => (cl?.yearSemesterId?._id ?? cl?.yearSemesterId) === selectedYS
      )
      .map((cl) => cl.section);
    return [...new Set(sections)]; // unique
  }, [selectedYS, classesList]);

  // derived: assignments filtered by section (frontend only)
  const filteredAssignments = useMemo(() => {
    if (selectedSection === ALL) return assignmentList;
    return assignmentList.filter((a) => a?.class?.section === selectedSection);
  }, [assignmentList, selectedSection]);

  // handlers
  const handleYSChange = async (value) => {
    setSelectedYS(value);
    setSelectedSection(ALL); // reset section filter on YS change

    try {
      if (value === ALL) {
        await getAssignments(); // fetch all
      } else {
        await getAssignments(value); // filtered by YS
      }
    } catch (e) {
      toast.error(e?.message || "Failed to load assignments");
    }
  };

  const openEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setEditDialogOpen(true);
  };

  const handleDelete = (assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    await toast
      .promise(deleteAssignment(assignmentToDelete._id), {
        loading: "Deleting assignment...",
        success: (res) => {
          if (res?.success)
            return res.message || "Assignment deleted successfully!";
          throw new Error(res?.message || "Failed to delete assignment.");
        },
        error: (err) => err.message || "Failed to delete assignment.",
      })
      .then((response) => {
        if (response.success) {
          setDeleteDialogOpen(false);
          setAssignmentToDelete(null);
          // refresh list based on current filter
          if (selectedYS === ALL) getAssignments();
          else getAssignments(selectedYS);
        }
      });
  };

  // helper for refresh after creation
  const refreshWithPageFilter = async (ysFilter) => {
    if (!ysFilter || ysFilter === ALL) return getAssignments();
    return getAssignments(ysFilter);
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
          <Button
            variant="contained"
            color="success"
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Assignment
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl fullWidth>
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

          <FormControl fullWidth disabled={selectedYS === ALL}>
            <InputLabel>Section</InputLabel>
            <Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              label="Section"
            >
              <MenuItem value={ALL}>All</MenuItem>
              {availableSections.map((sec) => (
                <MenuItem key={sec} value={sec}>
                  Section {sec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Record count */}
        <Typography sx={{ mb: 2, color: "white" }}>
          Total: {filteredAssignments?.length || 0} assignments
        </Typography>

        {/* Loading indicator */}
        {isLoading && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {/* Assignment Cards */}
        {!isLoading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 2,
            }}
          >
            {filteredAssignments?.map((a) => (
              <Card key={a._id} variant="outlined">
                <CardHeader
                  title={
                    <Tooltip
                      title={a?.course?.courseName || "Unknown Course"}
                      arrow
                      placement="top-start"
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -10],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{
                          maxWidth: "200px", // control width for truncation
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {a?.course?.courseName || "Unknown Course"}
                      </Typography>
                    </Tooltip>
                  }
                  action={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip
                        title="Edit"
                        arrow
                        placement="top-start"
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -10],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openEdit(a)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Delete"
                        arrow
                        placement="top-start"
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -10],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(a)}
                        >
                          <Trash2Icon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
                <Divider />
                <CardContent sx={{ display: "grid", rowGap: 1 }}>
                  <Typography variant="body2">
                    <strong>Faculty:</strong> {a?.faculty?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Class:</strong> {a?.class?.section}
                  </Typography>
                  {a?.course?.yearSemester && (
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Year {a.course.yearSemester.year} - Sem{" "}
                      {a.course.yearSemester.semester}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}

            {(!filteredAssignments || filteredAssignments.length === 0) && (
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, color: "white", gridColumn: "1/-1" }}
              >
                No assignments found.
              </Typography>
            )}
          </Box>
        )}

        {/* Create Assignment Dialog */}
        <CreateAssignment
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreated={refreshWithPageFilter}
          pageFilterYS={selectedYS}
        />

        {/* Edit Assignment Dialog */}
        <EditAssignment
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          yearSemesterFilter={selectedYS === ALL ? undefined : selectedYS}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete assignment for
            <b> {assignmentToDelete?.course?.courseName || "this course"}</b>?
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setAssignmentToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              autoFocus
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AssignmentManagement;
