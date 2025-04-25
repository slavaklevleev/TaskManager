import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Dropdown, Menu, Typography } from "antd";
import {
  PlayCircleFilled,
  StepForwardOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./LofiPlayerWidget.css";

const { Title } = Typography;

const getMotivationQuote = (progress) => {
  if (progress >= 0.75) return "Начни — это уже половина дела";
  if (progress >= 0.5) return "Держи фокус, ты на пути";
  if (progress >= 0.25) return "Половина позади — продолжай!";
  return "Финишная прямая — не сдавайся!";
};

const LofiPlayerWidget = () => {
  const [time, setTime] = useState(new Date());
  const [timer, setTimer] = useState(25 * 60); // 25 минут в секундах
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const timerInterval = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { m, s };
  };

  const { m: minutes, s: seconds } = formatTime(timer);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const addTime = () => {
    setTimer((prev) => prev + 5 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimer(25 * 60);
  };

  const menu = (
    <Menu>
      <Menu.Item icon={<ReloadOutlined />} onClick={resetTimer}>
        Сбросить таймер
      </Menu.Item>
    </Menu>
  );

  const progress = timer / (25 * 60);
  const quote = getMotivationQuote(progress);

  return (
    <Card className="lofi-widget" bodyStyle={{ padding: 20 }}>
      <div className="lofi-grid">
        <div className="time-display">
          <Title level={1} className="clock-text">
            {minutes}
          </Title>
          <Title level={1} className="clock-text">
            {seconds}
          </Title>
        </div>
        <div className="right-block">
          <div className="quote-badge">
          {quote}
          </div>
          <div className="player-buttons">
            <Dropdown overlay={menu} trigger={["click"]} placement="topCenter">
              <Button icon={<MoreOutlined />} className="control-btn small" />
            </Dropdown>
            <Button
              icon={<PlayCircleFilled />}
              className="control-btn big"
              onClick={toggleTimer}
            />
            <Button
              icon={<StepForwardOutlined />} // добавляет 5 минут
              className="control-btn small"
              onClick={addTime}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LofiPlayerWidget;
