import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import api from "../api/api";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import "../styles/projects.css";

const Projects = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
  }, []);

  const openCreate = () => {
    setEditingProject(null);
    setOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    form.setFieldsValue(project);
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingProject) {
        res = await api.patch(
          `/projects/${editingProject.id}`,
          values
        );
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id ? res.data : p
          )
        );
        message.success("Project updated");
      } else {
        res = await api.post("/projects", values);
        setProjects((prev) => [res.data, ...prev]);
        message.success("Project created");
      }
      setOpen(false);
    } catch {
      message.error("Operation failed");
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      message.success("Project deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  return (
    <>
      <header className="projects-header">
        <div className="container header-inner">
          <h2>Projects</h2>
          <div className="header-right">
            <span className="user-email">
                {user?.name || user?.email}
            </span>

          <Button
              icon={<LogoutOutlined />}
              type="text"
              onClick={logout}
            >Logout</Button>
          </div>
        </div>
      </header>

      <main className="projects-page">
        <div className="container">
            <div className="projects-toolbar">
            <h3>Check your projects</h3>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreate}
            >
                Create Project
            </Button>
            </div>

            <div className="projects-grid">
            {projects.map((project) => (
                <ProjectCard
                key={project.id}
                project={project}
                onEdit={openEdit}
                onDelete={deleteProject}
                />
            ))}
            </div>
        </div>
      </main>

      <Modal
        title={editingProject ? "Edit Project" : "Create Project"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="domain"
            label="Domain"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingProject ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Projects;
