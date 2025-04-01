import React from "react";
import { Card, Typography, Button, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "./NoteCard.css";

const { Title, Paragraph } = Typography;

const NoteCard = ({ title, content, color, onEdit, onDelete, onView }) => {
  const noteActionsMenu = (
    <Menu>
      <Menu.Item onClick={onEdit}>Редактировать</Menu.Item>
      <Menu.Item danger onClick={onDelete}>
        Удалить
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      className="note-card"
      style={{ backgroundColor: color, flex: "1 1 350px", }}
      bodyStyle={{ height: "100%", padding: 16 }}
      onClick={onView}
      hoverable
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown overlay={noteActionsMenu} trigger={["click"]}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        </div>
        <Paragraph ellipsis={{ rows: 12 }} style={{ marginTop: 12 }}>
          {content}
        </Paragraph>
      </div>
    </Card>
  );
};

export default NoteCard;
