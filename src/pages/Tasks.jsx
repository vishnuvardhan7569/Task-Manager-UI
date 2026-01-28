import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Form, Input, Select, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/tasks.css";

const { TextArea } = Input;
const { Option } = Select;

const Tasks = () => {
  const { projectId } = useParams();
  const { user, logout } = useAuth();
  const [form] = Form.useForm();

  const [state, setState] = useState({
    tasks: [],
    open: false,
    editingTask: null,
  });

  const { tasks, open, editingTask } = state;
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      updateState({ tasks: res.data });
    } catch (err) {
      message.error("Failed to load tasks");
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [projectId]);  

  const openCreate = () => {
    form.resetFields();
    updateState({ editingTask: null, open: true });
  };

  const openEdit = (task) => {
    form.setFieldsValue(task);
    updateState({ editingTask: task, open: true});
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTask) {
        const res = await api.patch(`/tasks/${editingTask.id}`, values);
        updateState({
          tasks: tasks.map((t) => (t.id === editingTask.id ? res.data : t)),
          open: false
        });
        message.success("Task updated");
      } else {
        const res = await api.post(`/projects/${projectId}/tasks`, values);
        updateState({
          tasks: [res.data, ...tasks],
          open: false
        });
        message.success("Task created");
      }
    } catch {
      message.error("Operation failed");
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
          await api.delete(`/tasks/${id}`);
          updateState({tasks: tasks.filter ((t)=>t.id !== id)});
          message.success("Task deleted");
        } catch {
          message.error("Delete failed");
        }
      },
    });
  };

  const statusColor = (status) => {
    if (status === "completed") return "green";
    if (status === "in_progress") return "blue";
    return "orange";
  };

  return (
    <>
      <header className="projects-header">
        <div className="header-left">Tasks</div>
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

      <section className="tasks-toolbar">
        <h3>Manage Tasks</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Create Task
        </Button>
      </section>

      <section className="tasks-grid">
        {tasks.length === 0 ? (
          <div className="tasks-empty">
          <h3>No tasks yet</h3>
          <p>Create a task to start tracking tasks</p>
          <Button type="primary" onClick={openCreate}>
            Create Task
          </Button>
        </div>
        ) : (
          tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <Tag
                className="task-status"
                color={statusColor(task.status)}
              >
                {task.status.replace("_", " ")}
              </Tag>

              <h3 className="task-title">{task.title}</h3>

              <p className="task-description">
                {task.description || "No description provided"}
              </p>

              <div className="task-actions">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => openEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <Modal
        title={editingTask ? "Edit Task" : "Create Task"}
        open={open}
        footer={null}
        onCancel={() => updateState({open: false})}
        destroyOnHidden
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Task Description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="not_started" placeholder="Not Started">
            <Select>
              <Option value="not_started">Not Started</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Button type="primary" block htmlType="submit">
            {editingTask ? "Update Task" : "Create Task"}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default Tasks;
