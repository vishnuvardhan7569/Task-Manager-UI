import { Button, Form, Input, Select, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/api";
import "../styles/auth.css";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await api.post('/signup', { user: values });
      message.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorData = error.response?.data?.errors;
      message.error(Array.isArray(errorData) ? errorData.join(', ') : 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <Card title={<div className="auth-card-title">Create Account</div>} className="auth-card" style={{ width: 450 }}>
        <Form form={form} name="signup" onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter a name" />
          </Form.Item>
          <Form.Item name="email" label="E-mail" rules={[{ type: 'email', required: true }]}>
            <Input placeholder="example@mail.com" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]} hasFeedback>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="password_confirmation" label="Confirm Password" dependencies={['password']} hasFeedback rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}>
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" initialValue="male">
            <Select options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]} />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" size="large">Sign Up</Button>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
