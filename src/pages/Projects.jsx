import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Input, message, Pagination } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
  });

  const { projects, open, editingProject, totalProjects, currentPage, pageSize } = state;
  const navigate = useNavigate();

  const fetchProjects = async (page = currentPage, limit = pageSize) => {
    try {
      const { projects: fetched, total_projects } = await getProjects({ page, limit });
      setState((prev) => ({
        ...prev,
        projects: fetched,
        totalProjects: total_projects,
        currentPage: page,
        pageSize: limit,
      }));
    } catch (err) {
      message.error("Failed to load projects");
    }
  };

  useEffect(() => { fetchProjects(1, pageSize); }, []);

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

  const openCreate = () => {
    form.resetFields();
    setState((prev) => ({ ...prev, editingProject: null, open: true }));
  };

  const openEdit = (project) => {
    form.setFieldsValue(project);
    setState((prev) => ({ ...prev, editingProject: project, open: true }));
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProject) {
        const res = await api.patch(`/projects/${editingProject.id}`, values);
        setState((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === editingProject.id ? res.data : p)),
          open: false,
        }));
        message.success("Project updated");
      } else {
        await api.post("/projects", values);
        await fetchProjects(1, pageSize);
        setState((prev) => ({ ...prev, open: false }));
        message.success("Project created");
      }
    } catch (err) {
      const errData = err.response?.data;
      const errors = errData?.errors;
      if (Array.isArray(errors)) message.error(errors.join(", "));
      else message.error(errData?.error || "Operation failed");
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
          await fetchProjects();
          if (state.currentPage > 1 && state.projects.length === 1) {
            await fetchProjects(state.currentPage - 1, state.pageSize);
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
          const errors = errData?.errors;
          if (Array.isArray(errors)) message.error(errors.join(", "));
          else message.error(errData?.error || "Delete failed");
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
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Create Project
            </Button>
          </div>

          <section className="projects-hero">
            <h1 className="projects-title">Your Projects</h1>
            <p className="projects-sub">
              Plan, track, and manage your projects. Create new projects or update existing ones below.
            </p>
          </section>

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

            {totalProjects > pageSize && (
              <div className="projects-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalProjects}
                  onChange={(page, size) => fetchProjects(page, size)}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} projects`}
                />
              </div>
            )}
          </div>
        </div>

        <Modal
          title={editingProject ? "Edit Project" : "Create Project"}
          open={open}
          footer={null}
          onCancel={() => setState((prev) => ({ ...prev, open: false }))}
          destroyOnHidden
          preserve={false}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="name" label="Project Name" rules={[{ required: true, message: "Please enter project name" }]}>
              <Input placeholder="Enter project name" />
            </Form.Item>
            <Form.Item name="domain" label="Domain" rules={[{ required: true, message: "Please enter domain" }]}>
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
