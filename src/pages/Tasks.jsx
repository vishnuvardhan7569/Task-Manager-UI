import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Button, Select, List, message } from "antd";
import api from "../api/api";

const { Option } = Select;

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data);
    } catch {
      message.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const createTask = async (values) => {
    setLoading(true);
    try {
      const res = await api.post(
        `/projects/${projectId}/tasks`,
        values
      );
      setTasks([res.data, ...tasks]);
      message.success("Task created");
    } catch {
      message.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.patch(`/tasks/${taskId}`, { status });
      setTasks(
        tasks.map((t) => (t.id === taskId ? res.data : t))
      );
    } catch {
      message.error("Failed to update task");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Create Task */}
      <Card title="Add Task" style={{ marginBottom: 24 }}>
        <Form layout="inline" onFinish={createTask}>
          <Form.Item
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder="Task title" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Add
          </Button>
        </Form>
      </Card>

      {/* Task List */}
      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <Card style={{ width: "100%" }}>
              <strong>{task.title}</strong>
              <div style={{ marginTop: 8 }}>
                <Select
                  value={task.status}
                  onChange={(value) =>
                    updateStatus(task.id, value)
                  }
                >
                  <Option value="pending">Pending</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Tasks;
