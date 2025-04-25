import React, { useEffect, useState } from "react";
import { Modal, Typography, message } from "antd";
import KanbanColumn from "../components/KanbanColumn";
import TaskModal from "../components/TaskModal";
import "./Tasks.css";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddProjectComment,
  useDeleteProjectComment,
  useUploadProjectFile,
  useDeleteProjectFile,
} from "../hooks/useProjects";

const { Paragraph } = Typography;

const Task = () => {
  const { data: projects, isLoading } = useProjects();
  const [messageApi, contextHolder] = message.useMessage();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const addComment = useAddProjectComment();
  const deleteComment = useDeleteProjectComment();
  const uploadFile = useUploadProjectFile();
  const deleteFile = useDeleteProjectFile();

  const [viewTask, setViewTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleAddTask = (columnKey) => {
    setActiveColumn(columnKey);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task, columnKey) => {
    setActiveColumn(columnKey);
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId) => {
    deleteProject.mutate(taskId, {
      onSuccess: () => messageApi.success("Задача удалена"),
    });
  };

  const handleCreateOrEditTask = async (taskData) => {
    const payload = {
      name: taskData.title,
      description: taskData.description,
      priority: taskData.priority.toLowerCase(),
      board: activeColumn,
      due_date: new Date().toISOString().slice(0, 10),
      complete_date: null,
    };

    if (editingTask) {
      await updateProject.mutateAsync({ id: editingTask.id, data: payload });

      // Обновим комментарии
      const oldComments = editingTask.comments || [];
      const newComments = taskData.comments || [];

      const toAdd = newComments.filter(
        (c) => !oldComments.some((oc) => oc.content === c)
      );
      const toDelete = oldComments.filter(
        (oc) => !newComments.includes(oc.content)
      );

      for (const comment of toAdd) {
        await addComment.mutateAsync({
          projectId: editingTask.id,
          content: comment,
        });
      }
      for (const comment of toDelete) {
        if (comment) await deleteComment.mutateAsync(comment.id);
      }

      const newFiles = taskData.files || [];
      const oldFiles = editingTask.files || [];

      for (const file of newFiles) {
        if (file.originFileObj) {
          await uploadFile.mutateAsync({
            projectId: editingTask.id,
            file: file.originFileObj,
          });
        }
      }

      const removedFiles = oldFiles.filter(
        (of) => !newFiles.some((nf) => nf.uid === of.id)
      );

      for (const file of removedFiles) {
        await deleteFile.mutateAsync(file.id);
      }

      messageApi.success("Проект обновлен");
    } else {
      const response = await createProject.mutateAsync(payload);
      const newProjectId = response.data.id;

      const newComments = taskData.comments || [];
      for (const comment of newComments) {
        await addComment.mutateAsync({
          projectId: newProjectId,
          content: comment,
        });
      }

      const newFiles = taskData.files || [];
      for (const file of newFiles) {
        if (file.originFileObj) {
          await uploadFile.mutateAsync({
            projectId: newProjectId,
            file: file.originFileObj,
          });
        }
      }

      messageApi.success("Проект добавлен");
    }

    setShowTaskModal(false);
    setEditingTask(null);
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      updateProject.mutate({
        id: draggableId,
        data: { board: destination.droppableId },
      });
    }
  };

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <>
      {contextHolder}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {["todo", "in_progress", "completed"].map((colKey) => (
            <Droppable droppableId={colKey} key={colKey}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <KanbanColumn
                    title={
                      colKey === "todo"
                        ? "Сделать"
                        : colKey === "in_progress"
                        ? "В процессе"
                        : "Завершено"
                    }
                    columnKey={colKey}
                    tasks={projects[colKey] || []}
                    canAdd={colKey === "todo"}
                    onAddTask={() => handleAddTask(colKey)}
                    onViewTask={(task) => setViewTask(task)}
                    onEditTask={(task) => handleEditTask(task, colKey)}
                    onDeleteTask={(taskId) => handleDeleteTask(taskId)}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal
        open={!!viewTask}
        onCancel={() => setViewTask(null)}
        footer={null}
        title={viewTask?.name}
      >
        {viewTask && (
          <>
            <Paragraph>
              <strong>Приоритет:</strong> {viewTask.priority}
            </Paragraph>
            <Paragraph>
              <strong>Описание:</strong> {viewTask.description}
            </Paragraph>
            <Paragraph>
              <strong>Комментарии:</strong>
              {(viewTask.comments || []).map((c) => (
                <Paragraph key={c.id}>— {c.content}</Paragraph>
              ))}
            </Paragraph>
            <Paragraph>
              <strong>Файлы:</strong>
              {(viewTask.files || []).map((f) => (
                <Paragraph key={f.id}>
                  <a
                    href={"http://127.0.0.1:8000/" + f.file_path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    — {f.file_path}
                  </a>
                </Paragraph>
              ))}
            </Paragraph>
          </>
        )}
      </Modal>

      <TaskModal
        visible={showTaskModal}
        onCancel={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrEditTask}
        initialValues={
          editingTask && {
            title: editingTask.name,
            description: editingTask.description,
            priority:
              editingTask.priority.charAt(0).toUpperCase() +
              editingTask.priority.slice(1),
            comments: editingTask.comments?.map((c) => c.content) || [],
            files:
              editingTask.files?.map((f) => ({
                uid: f.id,
                name: f.file_path.split("/").pop(),
                url: "http://127.0.0.1:8000/" + f.file_path,
              })) || [],
          }
        }
      />
    </>
  );
};

export default Task;
