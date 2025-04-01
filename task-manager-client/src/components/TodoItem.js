import React from 'react';
import { Card, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import './TodoItem.css';

const { Text } = Typography;

const TodoItem = ({ title, due_date, status, onToggle, onEdit }) => {
  const handleCardClick = (e) => {
    // Если клик был на кружок, не открывать редактор
    if (e.target.closest('.todo-checkbox')) return;
    onEdit && onEdit();
  };

const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
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
                className={`todo-checkbox ${status ? 'checked' : ''}`}
                onClick={(e) => {
                    e.stopPropagation(); // не даём всплыть событию
                    onToggle();
                }}
            >
                {status && <CheckOutlined style={{ color: 'white' }} />}
            </div>
            <div className="todo-text-block">
                <Text
                    className={status ? 'todo-title completed' : 'todo-title'}
                >
                    {title}
                </Text>
                <Text
                    type="secondary"
                    className={status ? 'todo-due_date completed' : 'todo-due_date'}
                >
                    {due_date ? formatDate(due_date) : "Нет даты"}
                </Text>
            </div>
        </div>
    </Card>
);
};

export default TodoItem;