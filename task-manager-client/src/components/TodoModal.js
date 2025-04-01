import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const TodoModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        due_date: initialValues.due_date ? dayjs(initialValues.due_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const data = {
        id: initialValues?.id || Date.now(),
        title: values.title,
        due_date: values.due_date.format('YYYY-MM-DD'),
        completed: initialValues?.completed || false,
      };
      onSubmit(data);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={initialValues ? 'Редактировать задачу' : 'Новая задача'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Название задачи"
          rules={[{ required: true, message: 'Введите название задачи' }]}
        >
          <Input placeholder="Например: Подготовить презентацию" />
        </Form.Item>
        <Form.Item
          name="due_date"
          label="Дедлайн"
          rules={[{ required: true, message: 'Выберите дату' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>Отменить</Button>
          <Button type="primary" onClick={handleSave}>Сохранить</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TodoModal;