import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../api/api";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import "../styles/projects.css";

const { confirm } = Modal;

const Projects = () => {
  const { user, logout } = useAuth();
  console.log("DEBUG: Full user object:", user);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    projects: [],
    open: false,
    editingProject: null,
  });

  const { projects, open, editingProject } = state;

  const updateState=(updates)=>{
    setState((prev)=>({...prev, ...updates}));
  };

  useEffect(() => {
    api
      .get("/projects")
      .then((res) => updateState({ projects: res.data })) 
      .catch(() => message.error("Failed to load projects"));
  }, []);

  function openCreate() {
    form.resetFields();
    updateState({ editingProject: null, open: true });
  }

  function openEdit(project) {
    form.setFieldsValue(project);
    updateState({ editingProject: project, open: true });
  }

  const handleSubmit = async (values) => {
    try {
      if (state.editingProject) {
        const res = await api.patch(`/projects/${state.editingProject.id}`,values);
        updateState({
          projects: state.projects.map((p) => (p.id === state.editingProject.id ? res.data : p)),
          open: false
        });
        message.success("Project updated");
      } else {
        const res = await api.post("/projects", values);
        updateState({
          projects: [...state.projects, res.data],
          open: false
        });
        message.success("Project created");
      }
    } catch {
      message.error("Operation failed");
    }
  };

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
          updateState({ projects: state.projects.filter((p) => p.id !== id) });
          message.success("Project deleted");
        } catch {
          message.error("Delete failed");
        }
      },
    });
  };

  return (
    <>
      <header className="projects-header">
        <div className="header-left">Projects</div>
        <div className="header-right">
          <span className="user-name">{user?.email}</span>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </header>

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

      <Modal
        title={editingProject ? "Edit Project" : "Create Project"}
        open={open}
        footer={null}
        onCancel={() => updateState({open: false})}
        destroyOnHidden
        preserve={false}
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
