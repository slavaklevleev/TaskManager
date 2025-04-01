import React from 'react';
import { Card, Tag, Dropdown, Menu, Typography } from 'antd';
import { MoreOutlined, MessageOutlined, FileOutlined } from '@ant-design/icons';
import './TaskCard.css';

const { Text, Paragraph } = Typography;

const priorityColors = {
  Low: 'green',
  High: 'red',
  Completed: 'blue',
};

const TaskCard = ({
  title,
  description,
  priority,
  commentsCount,
  filesCount,
  onView,
  onEdit,
  onDelete,
}) => {
    const menu = (
        <Menu
          onClick={(e) => e.domEvent.stopPropagation()} // предотвращаем всплытие при клике на пункт меню
        >
          <Menu.Item key="edit" onClick={(e) => { e.domEvent.stopPropagation(); onEdit(); }}>
            Редактировать
          </Menu.Item>
          <Menu.Item key="delete" danger onClick={(e) => { e.domEvent.stopPropagation(); onDelete(); }}>
            Удалить
          </Menu.Item>
        </Menu>
      );

  const handleClick = (e) => {
    // если клик был не по 3 точкам, открываем просмотр
    if (!e.target.closest('.task-card-menu')) {
      onView && onView();
    }
  };

  return (
    <Card
      className="task-card"
      bodyStyle={{ padding: 12 }}
      onClick={handleClick}
      hoverable
    >
      <div className="task-card-header">
        <Tag color={priorityColors[priority]}>{priority}</Tag>
        <Dropdown overlay={menu} trigger={['click']}>
          <MoreOutlined className="task-card-menu" style={{ cursor: 'pointer', fontSize: 18 }} />
        </Dropdown>
      </div>
      <Text strong style={{ fontSize: 16 }}>{title}</Text>
      <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ margin: '8px 0' }}>
        {description}
      </Paragraph>
      <div className="task-card-footer">
        <div className="task-card-footer-icons">
          <MessageOutlined /> <span>{commentsCount}</span>
          <FileOutlined style={{ marginLeft: 12 }} /> <span>{filesCount}</span>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;