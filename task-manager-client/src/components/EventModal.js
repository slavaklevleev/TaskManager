import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Row, Col, Button } from 'antd';
import dayjs from 'dayjs';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

const EventModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title || '',
        date: initialValues.start ? dayjs(initialValues.start) : null,
        startTime: initialValues.start ? dayjs(initialValues.start) : null,
        endTime: initialValues.end ? dayjs(initialValues.end) : null,
        comment: initialValues.comment || '',
        color: initialValues.color || COLORS[0],
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const startDate = values.date.set('hour', values.startTime.hour()).set('minute', values.startTime.minute());
      const endDate = values.date.set('hour', values.endTime.hour()).set('minute', values.endTime.minute());

      const newEvent = {
        id: initialValues?.id || Date.now(),
        title: values.title,
        start: startDate.toDate(),
        end: endDate.toDate(),
        comment: values.comment,
        color: values.color,
      };

      onSubmit(newEvent);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={initialValues?.id ? 'Редактировать событие' : 'Новое событие'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Название события"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Название события" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Дата события"
          rules={[{ required: true, message: 'Выберите дату' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Время начала"
              rules={[{ required: true, message: 'Укажите время начала' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Время конца"
              rules={[{ required: true, message: 'Укажите время окончания' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea rows={3} placeholder="Комментарий" />
        </Form.Item>

        <Form.Item label="Цвет события" name="color">
          <Row gutter={8}>
            {COLORS.map((color) => (
              <Col key={color}>
                <div
                  style={{
                    backgroundColor: color,
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: `2px solid ${form.getFieldValue('color') === color ? '#000' : 'transparent'}`,
                  }}
                  onClick={() => form.setFieldValue('color', color)}
                />
              </Col>
            ))}
          </Row>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>Отменить</Button>
          <Button type="primary" onClick={handleSave}>Сохранить</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EventModal;