import React, { useMemo, useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Flex,
  message,
  Popconfirm,
  Button,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./HabitCard.css";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru"); // Устанавливаем русский язык

const { Title, Text } = Typography;

const COLORS = {
  red: { light: "#FED5D5", dark: "#FF8A8A" },
  green: { light: "#D5FEDA", dark: "#55D764" },
  brown: { light: "#EFC9A1", dark: "#CE8F4D" },
  purple: { light: "#D3C3E8", dark: "#653F97" },
};

const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const HabitCard = ({
  color,
  title,
  streak,
  schedule,
  log,
  onLogUpdate,
  onDelete,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [habitLog, setHabitLog] = useState(log);

  const weekDays = useMemo(() => {
    const startOfWeek = dayjs().startOf("week"); // Понедельник
    return Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.add(i, "day");
      return {
        dayLabel: date.format("dd"), // сокращенное название дня, напр. Пн, Вт
        dateObj: date,
        dateStr: date.format("YYYY-MM-DD"),
        weekdayKey: date.format("ddd").toLowerCase().slice(0, 3), // mon, tue, wed и т.д.
      };
    });
  }, []);

  const handleToggleDay = (dateStr, enabledInSchedule, completed) => {
    if (!enabledInSchedule) {
      messageApi.warning("Этот день не запланирован для данной привычки");
      return;
    }
    const updatedLog = completed
      ? habitLog.filter((d) => d !== dateStr)
      : [...habitLog, dateStr];
    setHabitLog(updatedLog);
    onLogUpdate && onLogUpdate(dateStr, !completed);
  };

  return (
    <Card
      className="habit-card"
      style={{
        backgroundColor: COLORS[color].light,
        borderRadius: 16,
        padding: 20,
        flex: "1 1 315px",
        maxWidth: "100%",
      }}
      styles={{ body: { padding: 0 } }}
    >
      {contextHolder}
      <Flex style={{ marginBottom: 4 }} justify="space-between" align="center">
        <Flex justify="start" align="center" style={{ width: "100%" }}>
          <Title level={4} style={{ margin: "5px" }}>
            {title}
          </Title>
          <Popconfirm
            title="Вы уверены, что хотите удалить эту привычку?"
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

        <p style={{ display: "block", margin: "5px" }}>{streak} дней подряд</p>
      </Flex>
      <Row gutter={8} justify="space-between">
        {weekDays.map(({ dayLabel, dateObj, dateStr }, index) => {
          const weekdayKey = weekdayKeys[dateObj.day()];
          const enabled = schedule[weekdayKey];
          const completed = habitLog.includes(dateStr);

          return (
            <Col
              key={index}
              onClick={() => handleToggleDay(dateStr, enabled, completed)}
            >
              <div className="habit-day">
                <Text style={{ fontSize: 12, textAlign: "center" }}>
                  {dayLabel}
                </Text>
                <div
                  className={`habit-circle ${completed ? "completed" : ""} ${
                    enabled ? "habit-circle-enabled" : ""
                  }`}
                  style={{
                    borderColor: "white",
                    backgroundColor: completed
                      ? COLORS[color].dark
                      : enabled
                      ? "white"
                      : "transparent",
                  }}
                >
                  {dateObj.date()}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default HabitCard;
