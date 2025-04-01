import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, Typography } from "antd";
import "./TasksChartWidget.css";
import { useMonthlyTaskStats } from "../hooks/useProjectStats";

const { Title } = Typography;

const TasksChartWidget = () => {
  const { data, isLoading } = useMonthlyTaskStats();

  return (
    <Card
      className="tasks-chart-widget"
      style={{ height: "100%" }}
      bodyStyle={{ padding: 20 }}
    >
      <div className="tasks-chart-header" style={{ height: "100%" }}>
        <Title level={4} style={{ margin: 0, color: '#5F4AC6' }}>
          Все задачи
        </Title>
        <div className="tasks-chart-legend">
          <div className="legend-item">
            <div className="legend-dot done" />
            <span style={{ color: "#5F4AC6" }} >Выполнено</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot failed" />
            <span style={{ color: "#5F4AC6" }}>Не выполнено</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barSize={12}
          
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="done" fill="#52c41a" name="Выполнено" />
          <Bar dataKey="failed" fill="#f5222d" name="Не выполнено" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TasksChartWidget;
