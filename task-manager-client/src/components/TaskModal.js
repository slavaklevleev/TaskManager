import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Upload,
  Button,
  Space,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

const COLORS = {
  Low: '#52c41a',
  High: '#f5222d',
  Completed: '#1890ff',
};

const TaskModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        description: initialValues.description,
        priority: initialValues.priority,
        comments: initialValues.comments || [],
      });
      setFiles(initialValues.files || []);
    } else {
      form.resetFields();
      setFiles([]);
    }
  }, [initialValues, form]);

  const handleFileChange = ({ fileList }) => {
    setFiles(fileList);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        files,
      });
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      title={initialValues ? "Редактировать проект" : "Новый проект"}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="title"
          label="Название проекта"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Например: Запустить кампанию" />
        </Form.Item>

        <Form.Item name="description" label="Описание проекта">
          <TextArea rows={4} placeholder="Описание, детали, задачи..." />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Приоритет"
          rules={[{ required: true, message: "Выберите приоритет" }]}
        >
          <Row gutter={8}>
            {Object.keys(COLORS).map((key) => (
              <Col key={key}>
                <Button
                  type="default"
                  style={{ backgroundColor: COLORS[key], color: '#fff' }}
                  onClick={() => form.setFieldValue("priority", key)}
                >
                  {key}
                </Button>
              </Col>
            ))}
          </Row>
        </Form.Item>

        <Form.List name="comments">
          {(fields, { add, remove }) => (
            <>
              <Text strong>Комментарии:</Text>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                  <Col flex="auto" >
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[{ required: true, message: 'Введите комментарий' }]}
                      style={{margin: 0}}
                    >
                      <Input placeholder="Комментарий" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  Добавить комментарий
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label="Файлы">
          <Upload
            multiple
            fileList={files}
            onChange={handleFileChange}
            beforeUpload={() => false}
            onRemove={(file) => {
              setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Загрузить</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;