import React, { useContext } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { AuthContext } from "../context/AuthContext";
import * as authApi from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await authApi.login(values);
      login(response.data.access_token);
      navigate("/");
    } catch (e) {
      messageApi.error("Ошибка авторизации"); 
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
        {contextHolder}
      <Title level={3}>Вход</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Введите email" />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Войти
        </Button>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </Form>
    </Card>
  );
};

export default LoginPage;
