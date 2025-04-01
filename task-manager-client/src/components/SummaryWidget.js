import React from "react";
import { Card, Button, Typography, Calendar, Spin } from "antd";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "./SummaryWidget.css";
import { useActiveTaskStats } from "../hooks/useProjectStats";
import {
  PlusOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const COLORS = {
  'Выполнены': "#55D764",
  'В работе': "#FFCA6A",
  'Не начаты': "#9A7CFE",
};

const getProjectWord = (count) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "проект";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return "проекта";
  return "проектов";
};

const SummaryWidget = ({ onAddTask, onAddHabit }) => {
  const { data: pieData = [], isLoading } = useActiveTaskStats();
  const totalTasks = pieData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card
      className="summary-widget"
      bodyStyle={{
        padding: 20,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Calendar
        fullscreen={false}
        className="small-calendar"

        headerRender={({ value }) => {
          const month = value.format("MMMM");
          const year = value.year();
          return (
            <div
              style={{
                padding: "10px 16px",
                paddingTop: 0,
                marginTop: '-8%',
                fontWeight: 600,
                fontSize: "20px",
                textAlign: "center",
                color: "#5F4AC6",
              }}
            >
              {month.charAt(0).toUpperCase() + month.slice(1)} {year}
            </div>
          );
        }}
      />

      <div className="summary-buttons">
        <Button
          block
          onClick={onAddTask}
          style={{ marginBottom: 12}}
          color="purple"
          variant="outlined"
          size="large"
        >
          <PlusOutlined /> Новая задача
        </Button>
        <Button block onClick={onAddHabit} color="purple" variant="outlined" size="large">
        <PlusOutlined />  Новая привычка
        </Button>
      </div>

      <div style={{ height: 350, marginTop: 20, position: "relative", border: '1px solid #9254de', borderRadius: '8px', padding: '6px 10px' }}>
        <Title level={5} style={{ textAlign: "left", margin: 0, marginBottom: 30, color: '#9254de' }}>
          Все проекты
        </Title>
        {isLoading ? (
          <Spin />
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {!isLoading && (
          <div
            style={{
              position: "absolute",
              top: "54%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "72px",
              fontWeight: "bold",
              lineHeight: "39%",
              textAlign: "center",
              width: "150px",
            }}
          >
            {totalTasks}
            <br />
            <span style={{ fontSize: "12px" }}>
              {getProjectWord(totalTasks)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SummaryWidget;
