import { Routes, Route, Link } from "react-router-dom";
import { Button } from 'antd';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<ProtectedRoute> <Projects /> </ProtectedRoute>} />
        <Route path="/projects/:projectId/tasks" element={<ProtectedRoute> <Tasks /> </ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
