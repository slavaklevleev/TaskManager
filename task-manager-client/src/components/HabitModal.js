import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Row, Col, Typography, Button } from "antd";

const { Text } = Typography;

const COLORS = {
  red: { light: "#FED5D5", dark: "#FF8A8A" },
  green: { light: "#D5FEDA", dark: "#55D764" },
  brown: { light: "#EFC9A1", dark: "#CE8F4D" },
  purple: { light: "#D3C3E8", dark: "#653F97" },
};

const DAYS = [
  { key: "mon", label: "Пн" },
  { key: "tue", label: "Вт" },
  { key: "wed", label: "Ср" },
  { key: "thu", label: "Чт" },
  { key: "fri", label: "Пт" },
  { key: "sat", label: "Сб" },
  { key: "sun", label: "Вс" },
];

const HabitModal = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState("red");
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({ title: initialValues.title });
      setSelectedColor(initialValues.color || "red");
      setSelectedDays(
        DAYS.filter((day) => initialValues.frequency[day.key]).map(
          (day) => day.key
        )
      );
    } else {
      form.resetFields();
      setSelectedColor("red");
      setSelectedDays([]);
    }
  }, [initialValues, form]);

  const toggleDaySelection = (dayKey) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newHabit = {
        title: values.title,
        color: selectedColor,
        frequency: DAYS.reduce((acc, day) => {
          acc[day.key] = selectedDays.includes(day.key);
          return acc;
        }, {}),
      };
      onSave(newHabit);
      form.resetFields();
      setSelectedColor("red");
      setSelectedDays([]);
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      footer={null}
      title={initialValues ? "Редактировать привычку" : "Новая привычка"}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Название привычки"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Например, Чтение книг" />
        </Form.Item>

        <div>
          <Text strong>Цвет карточки:</Text>
          <Row gutter={8} style={{ marginTop: 8, marginBottom: 16 }}>
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
        </div>

        <div>
          <Text strong>Активные дни:</Text>
          <Row gutter={8} style={{ marginTop: 8 }}>
            {DAYS.map((day) => (
              <Col key={day.key}>
                <div
                  className={`day-square ${
                    selectedDays.includes(day.key) ? "selected" : ""
                  }`}
                  onClick={() => toggleDaySelection(day.key)}
                >
                  {day.label}
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <Button onClick={onCancel}>Отменить</Button>
          <Button type="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default HabitModal;