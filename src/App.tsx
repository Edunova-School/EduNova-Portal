import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Course from "./pages/course";
import ProgramChange from "./pages/programChange";
import Results from "./pages/result";
import RateLecturer from "./pages/rateLecturer";
import Fees from "./pages/fees";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffCourses from "./pages/staff/StaffCourses"
import StaffTimetable from "./pages/staff/StaffTimetable";
import StaffAttendance from "./pages/staff/StaffAttendance";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/courses" element={<Course />} />
        <Route path="/dashboard/program-change" element={<ProgramChange />} />
        <Route path="/dashboard/results" element={<Results />} />
        <Route path="/dashboard/rate-lecturer" element={<RateLecturer />} />
        <Route path="/dashboard/fees" element={<Fees />} />
        <Route path="/staff/dashboard" element={<StaffDashboard/>}></Route>
        <Route path="staff/courses" element={<StaffCourses/>}></Route>
        <Route path="staff/timetable" element={<StaffTimetable/>}></Route>
        <Route path="staff/attendance" element={<StaffAttendance/>}></Route>
      </Route>
    </Routes>
  );
}

export default App;