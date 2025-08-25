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

import { useYearSemesterStore } from "../store/yearsemester.slice";
import CreateYearSemester from "../components/CreateYearSemester";
import EditYearSemester from "../components/EditYearSemester";
import { get } from "react-hook-form";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const YearSemesterManagement = () => {
  const {
    isLoading,
    yearSemestersList,
    getYearSemesters,
    setSelectedYearSemester,
    deleteYearSemester,
  } = useYearSemesterStore();

  const [pageSize, setPageSize] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [yearSemesterToDelete, setYearSemesterToDelete] = useState(null);

  useEffect(() => {
    if (yearSemestersList.length === 0) {
      getYearSemesters();
    }
  }, [yearSemestersList, getYearSemesters]);

  const handleCreate = () => setCreateDialogOpen(true);

  const handleEdit = (yearSemester) => {
    setSelectedYearSemester(yearSemester);
    setEditDialogOpen(true);
  };

  const handleDelete = (yearSemester) => {
    setYearSemesterToDelete(yearSemester);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!yearSemesterToDelete) return;

    await toast
      .promise(deleteYearSemester(yearSemesterToDelete._id), {
        loading: "Deleting Year-Semester...",
        success: (res) => {
          if (res?.success)
            return res.message || "Year-Semester deleted successfully!";
          throw new Error(res?.message || "Failed to delete Year-Semester.");
        },
        error: (err) => err.message || "Failed to delete Year-Semester.",
      })
      .then((response) => {
        if (response.success) {
          setDeleteDialogOpen(false);
          setYearSemesterToDelete(null);
        }
      });
  };

  const columns = [
    { field: "branch", headerName: "Branch", flex: 1 },
    { field: "year", headerName: "Year", flex: 0.5 },
    { field: "semester", headerName: "Semester", flex: 0.5 },
    {
      field: "sections",
      headerName: "Sections",
      flex: 1,
      valueGetter: (value, row) => row.sections.join(", "),
    },
    {
      field: "classes",
      headerName: "Classes",
      flex: 2,
      valueGetter: (value, row) =>
        row.classes.map((cls) => `${cls.section} (${cls.status})`).join(", "),
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
            Year & Semester Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            color="success"
          >
            Add Year-Semester
          </Button>
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={yearSemestersList}
          columns={columns}
          loading={isLoading}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          getRowId={(row) => row?._id}
          disableSelectionOnClick
        />

        <CreateYearSemester
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />

        <EditYearSemester
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
            <b>
              {yearSemesterToDelete
                ? `Year ${yearSemesterToDelete.year} - Sem ${yearSemesterToDelete.semester} (${yearSemesterToDelete.branch})`
                : "this Year-Semester"}
            </b>
            ?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setYearSemesterToDelete(null);
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

export default YearSemesterManagement;
