import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Modal, Form, Input, Select, message, Tag, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api, { getTasks, getProject } from "../api/api";
import Header from "../components/Header";
import "../styles/tasks.css";

const { TextArea } = Input;

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [state, setState] = useState({
    tasks: [],
    open: false,
    editingTask: null,
    totalTasks: 0,
    currentPage: 1,
    pageSize: 8,
  });

  const { tasks, open, editingTask, totalTasks, currentPage, pageSize } = state;

  const fetchTasks = async (page = currentPage, limit = pageSize) => {
    try {
      const { tasks: fetched, total_tasks } = await getTasks(projectId, { page, limit });
      setState((prev) => ({
        ...prev,
        tasks: fetched,
        totalTasks: total_tasks,
        currentPage: page,
        pageSize: limit,
      }));
    } catch (err) {
      message.error("Failed to load tasks");
    }
  };

  useEffect(() => { if (projectId) fetchTasks(1, pageSize); }, [projectId]);

  const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const dispatchProjectUpdate = async (maybeProject) => {
    let project = maybeProject;
    if (!project || !project.id) {
      try {
        project = await getProject(projectId);
      } catch (err) {
        return;
      }
    }
    window.dispatchEvent(new CustomEvent("project-summary-updated", { detail: { project } }));
  };

  const openCreate = () => {
    form.resetFields();
    setState((prev) => ({ ...prev, editingTask: null, open: true }));
  };

  const openEdit = (task) => {
    form.setFieldsValue(task);
    setState((prev) => ({ ...prev, editingTask: task, open: true }));
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTask) {
        const res = await api.patch(`/projects/${projectId}/tasks/${editingTask.id}`, values);
        const updatedTask = res.data.task || res.data;
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)),
          open: false,
        }));
        const projectSummary = res.data.project_summary || res.data.projectSummary || res.data.project;
        await dispatchProjectUpdate(projectSummary);
        message.success("Task updated");
      } else {
        const res = await api.post(`/projects/${projectId}/tasks`, values);
        await fetchTasks(1, pageSize);
        const projectSummary = res.data.project_summary || res.data.projectSummary || res.data.project;
        await dispatchProjectUpdate(projectSummary);
        setState((prev) => ({ ...prev, open: false }));
        message.success("Task created");
      }
    } catch (err) {
      const errData = err.response?.data;
      const errors = errData?.errors;
      if (Array.isArray(errors)) message.error(errors.join(", "));
      else message.error(errData?.error || "Operation failed");
    }
  };

  const deleteTask = (id) => {
    Modal.confirm({
      title: "Delete task?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          const res = await api.delete(`/projects/${projectId}/tasks/${id}`);
          await fetchTasks();
          if (state.currentPage > 1 && state.tasks.length === 1) {
            await fetchTasks(state.currentPage - 1, state.pageSize);
          }
          const projectSummary = res?.data?.project_summary || res?.data?.projectSummary || res?.data?.project;
          await dispatchProjectUpdate(projectSummary);
          message.success("Task deleted");
        } catch (err) {
          const errData = err.response?.data;
          const errors = errData?.errors;
          if (Array.isArray(errors)) message.error(errors.join(", "));
          else message.error(errData?.error || "Delete failed");
        }
      },
    });
  };

  const statusColor = (status) => {
    if (status === "completed") return "green";
    if (status === "in_progress") return "blue";
    return "orange";
  };

  const statusLabel = (status) => status.replace("_", " ");

  return (
    <>
      <Header title="Tasks" />
      <main className="tasks-main">
        <div className="tasks-container">
          <div className="tasks-toolbar">
            <Button onClick={() => navigate("/projects")}>Back</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Create Task
            </Button>
          </div>

          <section className="tasks-hero">
            <h1 className="tasks-title">Manage Tasks</h1>
            <p className="tasks-sub">
              Track, update, and complete your project tasks. Create new tasks or update existing ones below.
            </p>
          </section>

          <div className="tasks-grid-container">
            <section className="tasks-grid">
              {tasks.length === 0 ? (
                <div className="tasks-empty">
                  <h3>No tasks yet</h3>
                  <p>Create a task to start tracking</p>
                  <Button type="primary" onClick={openCreate}>
                    Create Task
                  </Button>
                </div>
              ) : (
                tasks.map((task) => (
                  <div className="task-card" key={task.id}>
                    <Tag className="task-status" color={statusColor(task.status)}>
                      {statusLabel(task.status)}
                    </Tag>
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">
                      {task.description || "No description provided"}
                    </p>
                    <div className="task-actions">
                      <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(task)}>
                        Edit
                      </Button>
                      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </section>

            {totalTasks > pageSize && (
              <div className="tasks-pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalTasks}
                  onChange={(page, size) => fetchTasks(page, size)}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} tasks`}
                />
              </div>
            )}
          </div>
        </div>

        <Modal
          title={editingTask ? "Edit Task" : "Create Task"}
          open={open}
          footer={null}
          onCancel={() => setState((prev) => ({ ...prev, open: false }))}
          destroyOnHidden
          preserve={false}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="title" label="Task Title" rules={[{ required: true, message: "Please enter task title" }]}>
              <Input placeholder="Enter task title" />
            </Form.Item>
            <Form.Item name="description" label="Task Description">
              <TextArea rows={4} placeholder="Describe the task..." />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue="not_started">
              <Select options={statusOptions} />
            </Form.Item>
            <Button type="primary" block htmlType="submit">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </Form>
        </Modal>
      </main>
    </>
  );
};

export default Tasks;
