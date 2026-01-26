import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import {
  PlusOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import api from "../api/api";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import "../styles/projects.css";

const { confirm } = Modal;

const Projects = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => message.error("Failed to load projects"));
  }, []);

  /* ================= CREATE / EDIT ================= */
  const openCreate = () => {
    setEditingProject(null);
    form.resetFields();
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
        setProjects((prev) => [...prev, res.data]);
        message.success("Project created");
      }

      setOpen(false);
    } catch {
      message.error("Operation failed");
    }
  };

  /* ================= DELETE (CONFIRM) ================= */
  const deleteProject = (id) => {
    confirm({
      title: "Delete this project?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await api.delete(`/projects/${id}`);
          setProjects((prev) =>
            prev.filter((p) => p.id !== id)
          );
          message.success("Project deleted");
        } catch {
          message.error("Delete failed");
        }
      },
    });
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="projects-header">
        <div className="header-left">Projects</div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* ================= TOOLBAR ================= */}
      <section className="projects-toolbar">
        <h3>Choose ur projects</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
        >
          Create Project
        </Button>
      </section>

      {/* ================= PROJECT GRID ================= */}
      <section className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-projects">
            <h3>No projects yet</h3>
            <p>Create a project to start tracking tasks</p>
            <Button type="primary" onClick={openCreate}>
              Create Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={deleteProject}
            />
          ))
        )}
      </section>

      {/* ================= MODAL ================= */}
      <Modal
        title={editingProject ? "Edit Project" : "Create Project"}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
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

          <Button block type="primary" htmlType="submit">
            {editingProject ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Projects;
