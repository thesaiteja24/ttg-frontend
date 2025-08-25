import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";

import { useCourseStore } from "../store/course.slice";
import EditCourse from "../components/EditCourse";
import CreateCourse from "../components/CreateCourse";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const CourseManagement = () => {
  const { isLoading, courseList, getCourses, setSelectedCourse, deleteCourse } =
    useCourseStore();

  const [pageSize, setPageSize] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    if (courseList.length === 0) getCourses();
  }, [courseList, getCourses]);

  const handleCreate = () => setCreateDialogOpen(true);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    await toast
      .promise(deleteCourse(courseToDelete._id), {
        loading: "Deleting course...",
        success: (res) => {
          if (res?.success)
            return res.message || "Course deleted successfully!";
          throw new Error(res?.message || "Failed to delete course.");
        },
        error: (err) => err.message || "Failed to delete course.",
      })
      .then((response) => {
        if (response.success) {
          setDeleteDialogOpen(false);
          setCourseToDelete(null);
        }
      });
  };

  const columns = [
    { field: "courseId", headerName: "Course ID", flex: 1 },
    { field: "courseName", headerName: "Course Name", flex: 2 },
    { field: "courseShortName", headerName: "Short Name", flex: 1 },
    { field: "credits", headerName: "Credits", flex: 0.5 },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      valueGetter: (value, row) => {
        return row.yearSemesterId.branch;
      },
    },
    {
      field: "yearSemester",
      headerName: "Year & Semester",
      flex: 1,
      valueGetter: (value, row) =>
        `Year ${row?.yearSemesterId?.year} - Sem ${row?.yearSemesterId?.semester}`,
    },
    {
      field: "sections",
      headerName: "Sections",
      flex: 1,
      valueGetter: (value, row) => row?.yearSemesterId?.sections.join(", "),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            sx={{ margin: "8px 12px" }}
            variant="contained"
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params?.row)}
          >
            Edit
          </Button>
          <Button
            sx={{ margin: "8px 12px" }}
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params?.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ height: 600, width: "100%", p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ color: "white" }}>
            Course Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            color="success"
          >
            Add Course
          </Button>
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={courseList}
          columns={columns}
          loading={isLoading}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          getRowId={(row) => row?._id}
          disableSelectionOnClick
        />

        <CreateCourse
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />

        <EditCourse
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{" "}
            <b>{courseToDelete?.courseName || "this course"}</b>?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setCourseToDelete(null);
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

export default CourseManagement;
