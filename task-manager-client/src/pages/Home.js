import React, { useState } from "react";
import { Typography, Button, Card, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TodoListContainer from "../components/TodoListContainer";
import TasksChartWidget from "../components/TaskChartWidget";
import LofiPlayerWidget from "../components/LofiPlayerWidget";
import FocusWidget from "../components/FocusWidget";
import SummaryWidget from "../components/SummaryWidget";
import TaskModal from "../components/TaskModal";
import HabitModal from "../components/HabitModal";
import {
  useAddProjectComment,
  useCreateProject,
  useUploadProjectFile,
} from "../hooks/useProjects";
import { useCreateHabit } from "../hooks/useHabits";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const Home = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  // В дальнейшем сюда можно добавить хук useEffect для получения данных

  const createProject = useCreateProject();
  const createHabit = useCreateHabit();
  const addComment = useAddProjectComment();
  const uploadFile = useUploadProjectFile();

  const queryClient = useQueryClient();

  const handleCreateTask = async (data) => {
    const payload = {
      name: data.title,
      description: data.description,
      priority: data.priority.toLowerCase(),
      board: "todo",
      due_date: new Date().toISOString().slice(0, 10),
      complete_date: null,
    };

    const response = await createProject.mutateAsync(payload);
    const newProjectId = response.data.id;

    const newComments = data.comments || [];
    for (const comment of newComments) {
      await addComment.mutateAsync({
        projectId: newProjectId,
        content: comment,
      });
    }

    const newFiles = data.files || [];
    for (const file of newFiles) {
      if (file.originFileObj) {
        await uploadFile.mutateAsync({
          projectId: newProjectId,
          file: file.originFileObj,
        });
      }
    }

    messageApi.success("Проект добавлен");
    await queryClient.invalidateQueries({ queryKey: ["projectStatsTasks"] });
    await queryClient.invalidateQueries({ queryKey: ["projectStatsActive"] });
    setShowTaskModal(false);
  };

  const handleCreateHabit = async (data) => {
    createHabit.mutate(data, {
      onSuccess: () => messageApi.success("Привычка добавлена"),
    });
    setShowHabitModal(false);
  };

  return (
    <div style={{ height: "100%" }}>
      {contextHolder}
      <Row gutter={[24, 24]} style={{ height: "100%" }} align="stretch">
        <Col xs={24} lg={12} xl={18}>
          {/* Левая часть: ToDoList, Lofi, Focus, Chart */}
          <Row gutter={[24, 24]} style={{ height: "100%" }}>
            <Col xs={24} lg={24} xl={12}>
              <TodoListContainer />
            </Col>
            <Col
              xs={24}
              lg={24}
              xl={12}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div style={{ flex: 1 }}>
                <LofiPlayerWidget />
              </div>
              <div style={{ flex: 1 }}>
                <FocusWidget />
              </div>
            </Col>
            <Col xs={24} md={24}>
              <TasksChartWidget />
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={12} xl={6}>
          <Row gutter={[24, 24]} style={{ height: "100%", margin: 0 }}>
            <SummaryWidget
              onAddTask={() => setShowTaskModal(true)}
              onAddHabit={() => setShowHabitModal(true)}
            />
          </Row>
        </Col>
      </Row>
      <TaskModal
        visible={showTaskModal}
        onCancel={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
      />

      <HabitModal
        visible={showHabitModal}
        onCancel={() => setShowHabitModal(false)}
        onSave={handleCreateHabit}
      />
    </div>
  );
};

export default Home;
