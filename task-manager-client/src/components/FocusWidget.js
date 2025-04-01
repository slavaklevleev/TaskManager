import React, { useState, useRef } from "react";
import { Card, Typography, Button, Select, Modal, Flex } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import "./FocusWidget.css";

const { Title } = Typography;
const { Option } = Select;

const FocusWidget = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const audioRef = useRef(null);

  const startFocusSession = () => {
    setModalVisible(true);
    setTimeLeft(selectedMinutes * 60);
    audioRef.current.play();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          audioRef.current.pause();
          setModalVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(interval);
  };

  const stopSession = () => {
    clearInterval(intervalId);
    audioRef.current.pause();
    setModalVisible(false);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <Card
        className="focus-widget"
        bodyStyle={{ padding: 20, height: "100%" }}
      >
        <Flex vertical justify="space-between" style={{ height: "100%" }}>
          <Title
            level={3}
            style={{
              marginBottom: 20,
              textAlign: "left",
              fontSize: "44px",
              fontWeight: "bolder",
              lineHeight: "100%",
              margin: "0px",
              color: "#13421D"
            }}
          >
            Время
            <br />
            расслабиться
          </Title>
          <Flex align="center" justify="space-between">
            <Button
              icon={<PlayCircleFilled style={{ fontSize: 32 }} />}
              size="large"
              className="focus-play-btn"
              onClick={startFocusSession}
            />
            <div className="focus-time-select">
              <Select
                value={selectedMinutes}
                onChange={setSelectedMinutes}
                style={{ width: 100}}
                className="focus-select"
              >
                {[...Array(15)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1} минут
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
        </Flex>

        <audio
          ref={audioRef}
          src="https://r2.earth.fm/wp-content/uploads/2025/02/earth-fm_Gina-Lo_Rolling-pebbles-at-the-glass-cove.mp3"
        />
      </Card>

      <Modal
        open={modalVisible}
        footer={null}
        closable={false}
        centered
        width="90vw"
        bodyStyle={{ height: "90vh", padding: 0, overflow: "hidden" }}
      >
        <div className="focus-modal">
          <div className="focus-timer">{formatTime(timeLeft)}</div>
          <div class="ocean">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
          </div>
          <Button
            type="primary"
            danger
            onClick={stopSession}
            className="end-session-btn"
          >
            Завершить
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default FocusWidget;
