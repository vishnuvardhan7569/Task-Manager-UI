import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";

const PrivateRoutes = () => (
  <ProtectedRoute>
    <Routes>
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId/tasks" element={<Tasks />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<PrivateRoutes />} />
    </Routes>
  );
}

export default App;
