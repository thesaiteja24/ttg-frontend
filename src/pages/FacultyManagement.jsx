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
import DeleteIcon from "@mui/icons-material/Delete"; // use MUI’s delete icon
import { useFacultyStore } from "../store/faculty.slice";
import CreateFaculty from "../components/CreateFaculty";
import EditFaculty from "../components/EdiFaculty";
import { toast } from "react-hot-toast"
import { CalendarIcon } from "lucide-react";
import AvailabilityViewer from "../components/AvailabilityViewer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const FacultyManagement = () => {
  const {
    isLoading,
    facultyList,
    getFaculty,
    setSelectedFaculty,
    deleteFaculty,
  } = useFacultyStore();

  const [pageSize, setPageSize] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [availabilityDialogoOpen, setAvailabilityDialogoOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  useEffect(() => {
    if (facultyList.length === 0) getFaculty();
  }, [facultyList, getFaculty]);

  const handleCreate = () => setCreateDialogOpen(true);

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setEditDialogOpen(true);
  };

  const handleDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setDeleteDialogOpen(true);
  };

  const handleViewAvailability = (faculty) => {
    setSelectedFaculty(faculty);
    setAvailabilityDialogoOpen(true);
  };

  const confirmDelete = async () => {
    if (!facultyToDelete) return;

    await toast
      .promise(deleteFaculty(facultyToDelete._id), {
        loading: "Deleting faculty...",
        success: (res) => {
          if (res?.success)
            return res.message || "Faculty deleted successfully!";
          throw new Error(res?.message || "Failed to delete faculty.");
        },
        error: (err) => err.message || "Failed to delete faculty.",
      })
      .then((response) => {
        if (response.success) {
          setDeleteDialogOpen(false);
          setFacultyToDelete(null);
        }
      });
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      renderCell: (params) => `+${params.row.countryCode} ${params.row.phone}`,
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
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            sx={{ margin: "8px 12px" }}
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row)}
          >
            Delete
          </Button>
          <Button
            sx={{ margin: "8px 12px" }}
            variant="outlined"
            size="small"
            color="warning"
            startIcon={<CalendarIcon />}
            onClick={() => handleViewAvailability(params.row)}
          >
            View Availability
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
            Faculty Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            color="success"
          >
            Add Faculty
          </Button>
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={facultyList}
          columns={columns}
          loading={isLoading}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          getRowId={(row) => row._id}
          disableSelectionOnClick
        />

        {/* Create & Edit Dialogs */}
        <CreateFaculty
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
        <EditFaculty
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
            <b>{facultyToDelete?.name || "this faculty"}</b>?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setFacultyToDelete(null);
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

        <AvailabilityViewer
          open={availabilityDialogoOpen}
          onClose={() =>

            setAvailabilityDialogoOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
};

export default FacultyManagement;
