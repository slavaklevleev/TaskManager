import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Typography, Button } from "antd";
import "./NoteModal.css";

const { TextArea } = Input;
const { Text } = Typography;

const COLORS = {
  red: { light: "#FED5D5", dark: "#FF8A8A" },
  green: { light: "#D5FEDA", dark: "#55D764" },
  brown: { light: "#EFC9A1", dark: "#CE8F4D" },
  purple: { light: "#D3C3E8", dark: "#653F97" },
};

const NoteModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState(COLORS["red"].light);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        content: initialValues.content,
      });
      setSelectedColor(initialValues.color || COLORS["red"].light);
    } else {
      form.resetFields();
      setSelectedColor(COLORS["red"].light);
    }
  }, [initialValues, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const noteData = {
        ...values,
        color: selectedColor,
        id: initialValues?.id || Date.now(),
      };
      onSubmit(noteData);
      form.resetFields();
      setSelectedColor(COLORS["red"].light);
    });
  };

  return (
    <Modal
      title={initialValues ? "Редактировать заметку" : "Новая заметка"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Заголовок заметки"
          rules={[{ required: true, message: "Введите заголовок" }]}
        >
          <Input placeholder="Например: Идея проекта" />
        </Form.Item>

        <Form.Item name="content" label="Текст заметки">
          <TextArea rows={4} placeholder="Текст вашей заметки..." />
        </Form.Item>

        <Text strong>Цвет заметки:</Text>
        <Row gutter={8} style={{ marginTop: 10, marginBottom: 20 }}>
          {Object.keys(COLORS).map((colorKey) => (
            <Col key={colorKey}>
              <div
                className={`color-square ${
                  selectedColor === colorKey ? "selected" : ""
                }`}
                style={{ backgroundColor: COLORS[colorKey].light }}
                onClick={() => setSelectedColor(colorKey)}
              />
            </Col>
          ))}
        </Row>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onCancel}>Отменить</Button>
          <Button type="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NoteModal;
