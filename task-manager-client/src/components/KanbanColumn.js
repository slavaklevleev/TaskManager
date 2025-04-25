import React from "react";
import { Typography, Button, Divider, Badge } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TaskCard from "./TaskCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./KanbanColumn.css";
import { COLORS } from "../const";

const { Title } = Typography;

const columnColors = {
  todo: "purple",
  in_progress: "brown",
  completed: "green",
};

const KanbanColumn = ({
  title,
  columnKey,
  tasks,
  onAddTask,
  onViewTask,
  onEditTask,
  onDeleteTask,
  canAdd = true,
}) => {
  return (
    <div className="kanban-column" style={{ backgroundColor: COLORS[columnColors[columnKey]]?.light || "#fff" }}>
      <div className="kanban-column-header">
        <div className="kanban-column-header-left">
          <div
            className="kanban-color-dot"
            style={{ backgroundColor: COLORS[columnColors[columnKey]].dark }}
          />
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <Badge
            count={tasks.length}
            style={{
              backgroundColor: "#fff",
              color: 'black',
              marginLeft: "8px",
            }}
          />
        </div>
        {canAdd && (
          <Button type="text" icon={<PlusOutlined style={{color: "#5030E5"}} />} onClick={onAddTask} style={{backgroundColor: "#664BE570"}} />
        )}
      </div>

      <Divider style={{ margin: "8px 0 16px 0", backgroundColor: COLORS[columnColors[columnKey]].dark, borderTopWidth: '3px' }} />

      {tasks.map((task, index) => (
        <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <TaskCard
                title={task.name}
                description={task.description}
                priority={
                  task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                }
                commentsCount={task.comments?.length || 0}
                filesCount={task.files?.length || 0}
                onView={() => onViewTask(task)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default KanbanColumn;
