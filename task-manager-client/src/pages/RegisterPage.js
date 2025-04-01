import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import * as authApi from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

const RegisterPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { confirmPassword, ...payload } = values;

    try {
      await authApi.register(payload);
      messageApi.success("Регистрация прошла успешно");
    setTimeout(() => navigate("/login"), 1000);
    } catch (e) {
      messageApi.error("Ошибка регистрации");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      {contextHolder}
      <Title level={3}>Регистрация</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: "Введите имя" }]}
        >
          <Input placeholder="Ваше имя" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Некорректный email" },
          ]}
        >
          <Input placeholder="Введите email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: "Введите пароль" }]}
          hasFeedback
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Повторите пароль"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Повторите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Повторите пароль" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Зарегистрироваться
        </Button>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          Есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterPage;
