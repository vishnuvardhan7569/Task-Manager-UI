import { Routes, Route, Link } from "react-router-dom";
import { Button } from 'antd';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", width:"100vw"}}>
            <h1>Welcome to the Task Manager</h1>
            <h2>Check Your Projects, Tasks here and Complete them in Time :)</h2>
            <Link to="/projects">
              <Button type="primary" shape="round" size="large">
                Projects
              </Button>
            </Link>
          </div> 
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<ProtectedRoute> <Projects /> </ProtectedRoute>} />
        <Route path="/projects/:projectId/tasks" element={<ProtectedRoute> <Tasks /> </ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
