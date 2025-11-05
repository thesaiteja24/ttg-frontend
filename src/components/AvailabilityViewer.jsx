import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useFacultyStore } from "../store/faculty.slice";

const AvailabilityViewer = ({ open, onClose }) => {
  const {
    selectedFaculty,
    facultyAvailability,
    getFacultyAvailability,
    isLoading,
  } = useFacultyStore();
  const facultyId = selectedFaculty?._id;
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const totalPeriods = 6;

  console.log(selectedFaculty);

  useEffect(() => {
    if (open && selectedFaculty?._id) {
      getFacultyAvailability(selectedFaculty._id);
    }
  }, [open, facultyId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Faculty Availability
        <Button onClick={onClose}>Close</Button>
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container direction="column" spacing={2}>
            {/* Header */}
            <Grid item>
              <Grid container sx={{ display: "flex" }}>
                <Grid item sx={{ width: "120px", fontWeight: "bold" }}>
                  Period/Day
                </Grid>
                {days.map((day) => (
                  <Grid
                    item
                    key={day}
                    sx={{ flex: 1, textAlign: "center", fontWeight: "bold" }}
                  >
                    {day}
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Rows */}
            {[...Array(totalPeriods)].map((_, p) => (
              <Grid item key={p}>
                <Grid container sx={{ display: "flex", alignItems: "center" }}>
                  {/* Period Label */}
                  <Grid item sx={{ width: "120px" }}>
                    Period {p + 1}
                  </Grid>

                  {/* Availability Cells */}
                  {days.map((_, d) => {
                    const isAvailable =
                      facultyAvailability?.[p]?.[d]?.isAvailable;
                    return (
                      <Grid
                        item
                        key={`${p}-${d}`}
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          background: isAvailable ? "green" : "red",
                          borderRadius: "4px",
                          padding: "6px",
                          margin: "2px",
                        }}
                      >
                        {isAvailable ? "Yes" : "No"}
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityViewer;
