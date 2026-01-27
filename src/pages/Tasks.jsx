import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/tasks.css";

const { TextArea } = Input;
const { Option } = Select;

const Tasks = () => {
  const { projectId } = useParams();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    api
      .get(`/projects/${projectId}/tasks`)
      .then((res) => setTasks(res.data))
      .catch(() => message.error("Failed to load tasks"));
  }, [projectId]);

  const openCreate = () => {
    setEditingTask(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingTask) {
        res = await api.patch(`/tasks/${editingTask.id}`, values);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t))
        );
        message.success("Task updated");
      } else {
        res = await api.post(`/projects/${projectId}/tasks`, values);
        setTasks((prev) => [res.data, ...prev]);
        message.success("Task created");
      }
      setOpen(false);
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
          setTasks((prev) => prev.filter((t) => t.id !== id));
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

      <section className="tasks-toolbar">
        <h3>Manage Tasks</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Create Task
        </Button>
      </section>

      <section className="tasks-grid">
        {tasks.length === 0 ? (
          <Empty description="No tasks yet. Create one to get started." />
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
        onCancel={() => setOpen(false)}
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

          <Form.Item name="status" label="Status" initialValue="pending">
            <Select>
              <Option value="pending">Pending</Option>
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
