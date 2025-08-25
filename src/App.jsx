// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.jsx";
import Unauthorized from "./pages/Unauthorized";
import AdminPanel from "./pages/AdminPanel.jsx";
import Layout from "./components/Layout.jsx";
import { Toaster } from "react-hot-toast";
import FacultyManagement from "./pages/FacultyManagement.jsx";
import { Helmet } from "react-helmet";
import CourseManagement from "./pages/CourseManagement.jsx";
import YearSemesterManagement from "./pages/YearSemesterManagement.jsx";
import AssignmentManagement from "./pages/AssignmentManagement.jsx";

export default function App() {
  return (
    <>
      <Helmet>
        <title>Time Table Generator</title>
        <meta
          name="description"
          content="A web application for generating time tables."
        />
      </Helmet>
      <Layout>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontSize: "1.1rem",
              padding: "12px 20px",
              minWidth: "320px",
              maxWidth: "100%",
              background: "black",
              color: "white",
              border: "0.5px solid gray",
            },
            success: {
              style: {
                background: "black",
                color: "white",
                border: "0.5px solid green",
              },
            },
            error: {
              style: {
                background: "black",
                color: "white",
                border: "0.5px solid red",
              },
            },
            duration: 5000, // 5 seconds
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/faculty" element={<FacultyManagement />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/course" element={<CourseManagement />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/year-semester" element={<YearSemesterManagement />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/assignment" element={<AssignmentManagement />} />
          </Route>

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </>
  );
}
