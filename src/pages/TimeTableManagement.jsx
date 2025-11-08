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
  CircularProgress,
  Divider,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { useYearSemesterStore } from "../store/yearsemester.slice";
import axios from "axios";

const darkTheme = createTheme({ palette: { mode: "dark" } });
const ALL = "ALL";

const TimeTableManagement = () => {
  const { yearSemesters, classesList, getYearSemesters, getClasses } =
    useYearSemesterStore();

  const [selectedYS, setSelectedYS] = useState(ALL);
  const [selectedSection, setSelectedSection] = useState(ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [timetableData, setTimetableData] = useState(null);

  // bootstrap data
  useEffect(() => {
    if (!yearSemesters.length) getYearSemesters(true);
    if (!classesList.length) getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived: sections for the selected YS
  const availableSections = useMemo(() => {
    if (!selectedYS || selectedYS === ALL) return [];
    const sections = classesList
      .filter(
        (cl) => (cl?.yearSemesterId?._id ?? cl?.yearSemesterId) === selectedYS
      )
      .map((cl) => cl.section);
    return [...new Set(sections)];
  }, [selectedYS, classesList]);

  // fetch timetable from backend
  const fetchTimetable = async (yearSemesterId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:9999/api/v1/timetable/${yearSemesterId}`);
      if (res.data?.success) {
        setTimetableData(res.data.data || {});
        toast.success("Timetable fetched successfully");
      } else {
        setTimetableData(null);
        toast.error("Failed to fetch timetable");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load timetable");
    } finally {
      setIsLoading(false);
    }
  };

  // handle Year–Semester change
  const handleYSChange = async (value) => {
    setSelectedYS(value);
    setSelectedSection(ALL);
    if (value !== ALL) await fetchTimetable(value);
    else setTimetableData(null);
  };

  const selectedMatrix =
    selectedSection !== ALL && timetableData
      ? timetableData[selectedSection]
      : null;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

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
            Time Table Management
          </Typography>
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

        {/* Loading */}
        {isLoading && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {/* Show timetable */}
        {!isLoading && selectedMatrix && (
          <Card variant="outlined" sx={{ backgroundColor: "#1e1e1e" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Section {selectedSection}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "120px repeat(6, 1fr)",
                  gap: 1,
                }}
              >
                {/* Header Row */}
                <Box sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Period
                </Box>
                {days.map((day) => (
                  <Box
                    key={day}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      textAlign: "center",
                    }}
                  >
                    {day}
                  </Box>
                ))}

                {/* Rows for each period */}
                {selectedMatrix.map((periodRow, pIdx) => (
                  <>
                    <Box
                      key={`p-${pIdx}`}
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        bgcolor: "#222",
                        borderRadius: 1,
                        py: 1,
                      }}
                    >
                      {`P${pIdx + 1}`}
                    </Box>
                    {periodRow.map((slot, dIdx) => (
                      <Box
                        key={`cell-${pIdx}-${dIdx}`}
                        sx={{
                          textAlign: "center",
                          border: "1px solid #333",
                          borderRadius: 1,
                          minHeight: "70px",
                          p: 1,
                          bgcolor: slot ? "#2b2b2b" : "transparent",
                        }}
                      >
                        {slot ? (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {slot.courseName}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {slot.facultyName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: "block", opacity: 0.6 }}
                            >
                              {slot.isLab ? "Lab" : "Theory"}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="caption" sx={{ opacity: 0.4 }}>
                            —
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* No selection message */}
        {!isLoading &&
          selectedYS !== ALL &&
          selectedSection !== ALL &&
          !selectedMatrix && (
            <Typography sx={{ mt: 3, opacity: 0.7, color: "white" }}>
              No timetable found for this section.
            </Typography>
          )}
      </Box>
    </ThemeProvider>
  );
};

export default TimeTableManagement;
