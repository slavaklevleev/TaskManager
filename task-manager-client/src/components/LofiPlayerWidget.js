import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Dropdown, Menu, Slider, Typography } from "antd";
import {
  PlayCircleFilled,
  PauseOutlined,
  StepForwardOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import "./LofiPlayerWidget.css";

const { Title } = Typography;

const getMotivationQuote = (hour) => {
  if (hour >= 9 && hour < 12) return "Пора поработать";
  if (hour >= 12 && hour < 15) return "Сохраняй фокус!";
  if (hour >= 15 && hour < 18) return "Финишная прямая!";
  return "Время отдыха";
};

const stations = [
    { name: 'ChillHop', url: 'https://ilovemusic.de/ilovechillhop.m3u' },
    { name: 'ChillOut Beats', url: 'https://ilovemusic.de/ilovechilloutbeats.m3u' },
    { name: 'Music&Chill', url: 'https://ilovemusic.de/ilovemusicandchill.m3u' },
  ];

const LofiPlayerWidget = () => {
  const [time, setTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('error', (e) => {
        console.error('Ошибка загрузки потока:', e);
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = stations[currentStationIndex].url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.error(e));
      }
    }
  }, [currentStationIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextStation = () => {
    setCurrentStationIndex((prev) => (prev + 1) % stations.length);
  };

  const handleStationSelect = ({ key }) => {
    setCurrentStationIndex(Number(key));
    setIsPlaying(true);
    setTimeout(() => audioRef.current.play(), 100);
  };


  const menu = (
    <Menu onClick={handleStationSelect}>
      <Menu.Item disabled style={{ opacity: 0.7 }}>Радиостанции</Menu.Item>
      {stations.map((station, index) => (
        <Menu.Item key={index}>{station.name}</Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item disabled style={{ opacity: 0.7 }}>Громкость</Menu.Item>
      <Menu.Item key="volume" disabled>
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={setVolume}
          style={{ width: 150 }}
        />
      </Menu.Item>
    </Menu>
  );

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <Card className="lofi-widget" bodyStyle={{ padding: 20 }}>
      <div className="lofi-grid">
        <div className="time-display">
          <Title level={1} className="clock-text">
            {hours}
          </Title>
          <Title level={1} className="clock-text">
            {minutes}
          </Title>
        </div>
        <div className="right-block">
          <div className="quote-badge">
            {getMotivationQuote(time.getHours())}
          </div>
          <div className="player-buttons">
          <Dropdown overlay={menu} trigger={['click']} placement="topCenter">
              <Button icon={<MoreOutlined />} className="control-btn small" />
            </Dropdown>
            <Button
              icon={isPlaying ? <PauseOutlined /> : <PlayCircleFilled />}
              className="control-btn big"
              onClick={togglePlay}
            />
            <Button
              icon={<StepForwardOutlined />}
              className="control-btn small"
              onClick={nextStation}
            />
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
      />
    </Card>
  );
};

export default LofiPlayerWidget;
