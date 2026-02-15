import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseProblems from "./pages/CourseProblems";
import ProblemDetail from "./pages/ProblemDetail";
import Login from "./pages/Login";
import Search from "./pages/Search";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course" element={<CourseDetail />} />
      <Route path="/course-problems" element={<CourseProblems />} />
      <Route path="/problem" element={<ProblemDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
