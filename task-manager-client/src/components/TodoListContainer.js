import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Badge,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TodoItem from "./TodoItem";
import TodoModal from "./TodoModal";
import dayjs from "dayjs";
import "./TodoListContainer.css";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../hooks/useTodos";

const { Title } = Typography;

const TodoListContainer = () => {
  const { data: todos = [], isLoading } = useTodos();
  const [messageApi, contextHolder] = message.useMessage();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const [showAllModal, setShowAllModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const handle = (e) => {
      const task = todos.find((t) => t.id === e.detail.id);
      if (task) {
        setEditingTask(task);
        setShowTodoModal(true);
      }
    };
    window.addEventListener("open-task-modal", handle);
    return () => window.removeEventListener("open-task-modal", handle);
  }, [todos]);

  // Функция открытия модалки для редактирования:
  const openEditModal = (task) => {
    setEditingTask(task);
    setShowTodoModal(true);
  };

  const handleCreateOrEditTask = (todoData) => {
    if (editingTask) {
      updateTodo.mutate(
        { id: editingTask.id, data: todoData },
        { onSuccess: () => messageApi.success('Задача обновлена') }
      );
    } else {
      createTodo.mutate(todoData, { onSuccess: () => messageApi.success('Задача добавлена') });
    }
    setShowTodoModal(false);
    setEditingTask(null);
  };

  const handleDelete = (id) => {
    deleteTodo.mutate(id, { onSuccess: () => messageApi.success('Задача удалена') });
  };

  const toggleTodo = (todo) => {
    updateTodo.mutate({ id: todo.id, data: { status: !todo.status } })
  };

  const nearestFive = [...todos]
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <Card
      style={{ borderRadius: 16, height: "100%" }}
      bodyStyle={{ padding: 20, backgroundColor: "#DDE8F7", height: "100%", borderRadius: 16, }}
    >
      {contextHolder}
      <div className="todo-header">
        <div className="todo-header-actions">
          <Title level={3} style={{ margin: "8px 0" }}>
            Задачи
          </Title>
          <Badge
            count={todos.length}
            style={{
              backgroundColor: "#1890ff",
              cursor: "pointer",
              marginLeft: "8px",
            }}
            onClick={() => setShowAllModal(true)}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTask(null);
            setShowTodoModal(true);
          }}
        />
      </div>

      {nearestFive.map((todo) => (
        <TodoItem
          key={todo.id}
          title={todo.title}
          due_date={todo.due_date}
          status={todo.status}
          onToggle={() => toggleTodo(todo)}
          onEdit={() => openEditModal(todo)}
          onDelete={() => handleDelete(todo.id)}
        />
      ))}

      {/* Модальное окно со всеми задачами */}
      <Modal
        open={showAllModal}
        onCancel={() => setShowAllModal(false)}
        footer={null}
        title="Все задачи"
      >
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            title={todo.title}
            due_date={todo.due_date}
            status={todo.status}
            onToggle={() => toggleTodo(todo)}
          />
        ))}
      </Modal>

      {/* Модалка добавления/редактирования задачи */}
      <TodoModal
        visible={showTodoModal}
        onCancel={() => {
          setShowTodoModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrEditTask}
        initialValues={editingTask}
      />
    </Card>
  );
};

export default TodoListContainer;
