import React, { useState } from "react";
import HabitCard from "../components/HabitCard";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Typography,
} from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import "./Habits.css";
import TodoListContainer from "../components/TodoListContainer";
import HabitModal from "../components/HabitModal";
import {
  useCreateHabit,
  useHabits,
  useUpdateHabitLog,
  useDeleteHabit
} from "../hooks/useHabits";

const { Title, Text } = Typography;

const Habits = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: habits = [], isLoading } = useHabits();
  const createHabit = useCreateHabit();
  const updateHabitLog = useUpdateHabitLog();
  const deleteHabit = useDeleteHabit();

  const [modalVisible, setModalVisible] = useState(false);

  const handleAddHabit = (habitData) => {
    createHabit.mutate(habitData, {
      onSuccess: () => messageApi.success("Привычка добавлена"),
    });
    setModalVisible(false);
  };

  const handleLogUpdate = (habitId, date) => {
    updateHabitLog.mutate({ habitId: habitId, date: date });
  };

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <Row gutter={[16, 16]}>
      {contextHolder}
      <Col xs={{ flex: "100%", order: 2 }} lg={{ flex: "50%", order: 1 }}>
        <TodoListContainer />
      </Col>
      <Col xs={{ flex: "100%", order: 1 }} lg={{ flex: "50%", order: 2 }}>
        <Card
          style={{ marginBottom: 24, borderRadius: 16 }}
          bodyStyle={{ padding: 20 }}
        >
          <div className="habits-header">
            <Title level={3}>Привычки</Title>
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={() => setModalVisible(true)}
            >
              Добавить
            </Button>
          </div>

          <Flex wrap gap={8}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                schedule={habit.frequency}
                streak={habit.streak}
                log={habit.recent_logs
                  .filter((log) => log.completed)
                  .map((log) => log.date)}
                color={habit.color} // можно дополнить, если есть цвет в API
                onLogUpdate={(date) => {
                  handleLogUpdate(
                    habit.id,
                    date
                  );
                }}
                onDelete={() => {
                  deleteHabit.mutate(habit.id, {
                    onSuccess: () => messageApi.success("Привычка удалена"),
                  });
                }}
              />
            ))}
          </Flex>

          <HabitModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onSave={handleAddHabit}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Habits;
