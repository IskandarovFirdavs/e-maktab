import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar.jsx";
import styled, { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "./styles/theme.js";
import AppWrapper from "./styles/AppWrapper.jsx";
import PrivateRoute from "./context/PrivateRoute.jsx";
// Pages
import Faculties from "./pages/Faculties.jsx";
import Directions from "./pages/Directions.jsx";
import PractiseDetail from "./pages/PractiseDetail.jsx";
import Departments from "./pages/Departments.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentDetail from "./pages/StudentDetail.jsx";
import StudentPractise from "./pages/StudentPractise.jsx";
import StudentPractiseCreate from "./pages/StudentPractiseCreate.jsx";
import Students from "./pages/Students.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./auth/Login.jsx";
import Groups from "./pages/Groups.jsx";

function AppContent() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("preferredTheme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("preferredTheme", dark ? "dark" : "light");
  }, [dark]);

  const location = useLocation();

  // Login sahifasida navbar ko'rsatilmaydi
  const hideNavbar = location.pathname === "/";

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <AppWrapper>
        {/* Navbar faqat login pageda ko'rinmaydi */}
        {!hideNavbar && <Navbar dark={dark} setDark={setDark} />}

        <Routes>
          <Route path="/" element={<Login dark={dark} setDark={setDark} />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route
            path="/student/practise/create"
            element={<StudentPractiseCreate />}
          />
          <Route path="/student/practise/:id" element={<StudentPractise />} />
          <Route path="/student/:id/day/:dayId" element={<PractiseDetail />} />

          {/* ID bilan yo'llar */}
          <Route
            path="/faculty/:id"
            element={
              <PrivateRoute>
                <Departments />
              </PrivateRoute>
            }
          />

          <Route
            path="/department/:id"
            element={
              <PrivateRoute>
                <Directions />
              </PrivateRoute>
            }
          />
          <Route
            path="/direction/:id"
            element={
              <PrivateRoute>
                <Groups />
              </PrivateRoute>
            }
          />

          <Route
            path="/faculties"
            element={
              <PrivateRoute>
                <Faculties />
              </PrivateRoute>
            }
          />

          <Route
            path="/group/:id"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AppWrapper>
    </ThemeProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
