import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Input, message, Pagination } from "antd";
import { PlusOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import api, { getProjects } from "../api/api";
import ProjectCard from "../components/ProjectCard";
import Header from "../components/Header";
import "../styles/projects.css";

const { confirm } = Modal;

const Projects = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    projects: [],
    open: false,
    editingProject: null,
    totalProjects: 0,
    currentPage: 1,
    pageSize: 8,
    loading: false,
  });

  const { projects, open, editingProject, totalProjects, currentPage, pageSize, loading } = state;
  const navigate = useNavigate();

  // Get existing project names for validation
  const existingProjectNames = projects.map(p => p.name.toLowerCase());

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchPage = async (page = currentPage, limit = pageSize) => {
    updateState({ loading: true });
    try {
      const { projects: fetched, total_projects } = await getProjects({ page, limit });
      updateState({ projects: fetched, totalProjects: total_projects, currentPage: page, pageSize: limit });
    } catch (err) {
      message.error("Failed to load projects");
    } finally {
      updateState({ loading: false });
    }
  };

  const loadProjects = () => fetchPage(1, pageSize);

  useEffect(() => { loadProjects(); }, []);

  useEffect(() => {
    const handler = (e) => {
      const project = e?.detail?.project;
      if (!project || !project.id) return;
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === project.id ? { ...p, ...project } : p)),
        totalProjects: project.total_tasks != null ? project.total_tasks : prev.totalProjects,
      }));
    };

    window.addEventListener("project-summary-updated", handler);
    return () => window.removeEventListener("project-summary-updated", handler);
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
        const res = await api.patch(`/projects/${state.editingProject.id}`, values);
        updateState({
          projects: state.projects.map((p) => (p.id === state.editingProject.id ? res.data : p)),
          open: false
        });
        message.success("Project updated");
      } else {
        const res = await api.post("/projects", values);
        await fetchPage(1, state.pageSize);
        updateState({ open: false });
        message.success("Project created");
      }
    } catch (err) {
      const errData = err.response?.data;
      const errs = errData?.errors || errData?.error || errData;
      if (Array.isArray(errs)) message.error(errs.join(", "));
      else if (typeof errs === "string") message.error(errs);
      else message.error("Operation failed");
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
          const res = await api.delete(`/projects/${id}`);
          await fetchPage();
          if (state.currentPage > 1 && state.projects.length === 1) {
            await fetchPage(state.currentPage - 1, state.pageSize);
          }
          const projectSummary = res?.data?.project_summary || res?.data?.projectSummary || res?.data?.project;
          if (projectSummary) {
            setState((prev) => ({
              ...prev,
              projects: prev.projects.filter((p) => p.id !== id),
              totalProjects: projectSummary.total_projects != null ? projectSummary.total_projects : Math.max(0, (prev.totalProjects || prev.projects.length) - 1),
            }));
          }
          message.success("Project deleted");
        } catch (err) {
          const errData = err.response?.data;
          const errs = errData?.errors || errData?.error || errData;
          if (Array.isArray(errs)) message.error(errs.join(", "));
          else if (typeof errs === "string") message.error(errs);
          else message.error("Delete failed");
        }
      },
    });
  };

  return (
    <>
      <Header title='Projects' />
      <main className="projects-main">
        <div className="projects-container">
          <div className="projects-toolbar">
            <Button onClick={() => navigate("/")}>Back</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
            >
              Create Project
            </Button>
          </div>

          {/* Hero Section */}
          <section className="projects-hero">
            <h1 className="projects-title">Your Projects</h1>
            <p className="projects-sub">
              Plan, track, and manage your team's projects. Create new projects or update existing ones below.
            </p>
          </section>

          {/* Grid Container */}
          <div className="projects-grid-container">
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

            {/* Pagination */}
            {totalProjects > pageSize && (
              <div className="projects-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalProjects}
                  onChange={(page, size) => fetchPage(page, size)}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} projects`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal
          title={editingProject ? "Edit Project" : "Create Project"}
          open={open}
          footer={null}
          onCancel={() => updateState({ open: false })}
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
              rules={[
                { required: true, message: "Please enter project name" },
                { 
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const normalizedValue = value.toLowerCase().trim();
                    // When editing, allow the original name
                    if (editingProject && normalizedValue === editingProject.name.toLowerCase().trim()) {
                      return Promise.resolve();
                    }
                    // Check if any other project has the same name
                    if (existingProjectNames.includes(normalizedValue)) {
                      return Promise.reject(new Error("A project with this name already exists"));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>

            <Form.Item
              name="domain"
              label="Domain"
              rules={[{ required: true, message: "Please enter domain" }]}
            >
              <Input placeholder="e.g., Development, Design, Marketing" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Describe your project..." />
            </Form.Item>

            <Button block type="primary" htmlType="submit">
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </Form>
        </Modal>
      </main>
    </>
  );
};

export default Projects;

