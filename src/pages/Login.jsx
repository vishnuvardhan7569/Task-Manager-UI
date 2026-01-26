import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Card, message } from "antd";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const res = await api.post("/login", {
        email: values.email,
        password: values.password,
      });

      login(res.data.token);
      message.success("Welcome back!");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Invalid credentials"
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        title={<div style={{ textAlign: "center" }}>Log In</div>}
        style={{
          width: 360,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, type: "email", message: "Enter valid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Enter your password" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" size="large">
              Log in
            </Button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              or <Link to="/signup">Register now!</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
