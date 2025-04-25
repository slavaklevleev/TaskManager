import React from "react";
import { Button, Card, Flex, Popconfirm, Typography } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import "./TodoItem.css";

const { Text } = Typography;

const TodoItem = ({ title, due_date, status, onToggle, onEdit, onDelete }) => {
  const handleCardClick = (e) => {
    // Если клик был на кружок, не открывать редактор
    if (
        e.target.closest(".todo-checkbox") ||
        e.target.closest(".ant-btn-dangerous") ||
        e.target.closest(".delete-task-button") ||
        e.target.closest(".ant-popover")
    ) {
        return;
    }
    onEdit && onEdit();
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  return (
    <Card
      className="todo-item-card"
      bodyStyle={{ padding: 16 }}
      onClick={handleCardClick}
      hoverable
    >
      <div className="todo-item-content">
        <div
          className={`todo-checkbox ${status ? "checked" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // не даём всплыть событию
            onToggle();
          }}
        >
          {status && <CheckOutlined style={{ color: "white" }} />}
        </div>
        <div className="todo-text-block" style={{width: "100%"}}>
          <Flex justify="space-between" align="center" style={{ width: "100%" }}>
            <Text className={status ? "todo-title completed" : "todo-title"}>
              {title}
            </Text>
            <Popconfirm
              title="Вы уверены, что хотите удалить эту задачу?"
              onConfirm={onDelete}
              okText="Да"
              cancelText="Нет"
              className="delete-task-button"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()} // Не даём всплыть событию
              />
            </Popconfirm>
          </Flex>
          <Text
            type="secondary"
            className={status ? "todo-due_date completed" : "todo-due_date"}
          >
            {due_date ? formatDate(due_date) : "Нет даты"}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default TodoItem;
