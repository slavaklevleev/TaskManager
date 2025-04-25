import React, { useContext, useState } from "react";
import {
  AutoComplete,
  Input,
  Avatar,
  Typography,
  Space,
  Dropdown,
  message,
  Menu,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  FireOutlined,
  LogoutOutlined,
  ProjectOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../context/AuthContext";
import "./AppHeader.css";
import { useProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useGlobalSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";

const { Text } = Typography;

const AppHeader = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, error } = useProfile();
  if (error) {
    messageApi.error("Ошибка загрузки профиля");
  }

  const user = data?.data || { name: "Пользователь", avatarUrl: null };

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { data: results } = useGlobalSearch(debouncedQuery);

  if (isLoading) return null;
  
  const handleSelect = (value, option) => {
    const { type, id } = option;

    switch (type) {
      case "projects":
        navigate(`/projects`);
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("open-project-modal", { detail: { id } })
          );
        }, 0);
        break;
      case "habits":
        navigate(`/habits`);
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("open-habit-modal", { detail: { id } })
          );
        }, 300);
        break;
      case "tasks":
        navigate(`/habits`);
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("open-task-modal", { detail: { id } })
          );
        }, 0);
        break;
      case "notes":
        navigate(`/notes`);
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("open-note-modal", { detail: { id } })
          );
        }, 0);
        break;
      case "events":
        navigate(`/schedule`);
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("open-event-modal", { detail: { id } })
          );
        }, 300);
        break;
      default:
        break;
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'projects': return <ProjectOutlined />;
      case 'habits': return <FireOutlined />;
      case 'tasks': return <CheckCircleOutlined />;
      case 'notes': return <FileTextOutlined />;
      case 'events': return <CalendarOutlined />;
      default: return <SearchOutlined />;
    }
  };

  const groupedOptions = Object.entries(results || {}).flatMap(
    ([type, items]) =>
      items.map((item) => ({
        key: type + item.id,
        value: item.title,
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {getIconForType(type)} {item.title}
          </span>
        ),
        type,
        id: item.id,
        group: type[0].toUpperCase() + type.slice(1),
      }))
  );

  const displayOptions = Object.values(
    groupedOptions.reduce((acc, curr) => {
      acc[curr.group] = acc[curr.group] || { label: curr.group, options: [] };
      acc[curr.group].options.push(curr);
      return acc;
    }, {})
  );

  const handleLogout = () => {
    logout();
    messageApi.info("Вы вышли из аккаунта");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  if (!isAuthenticated) {
    return <>{contextHolder}</>;
  } else {
    return (
      <div className="app-header">
        {contextHolder}
        <AutoComplete
          style={{ width: "100%" }}
          options={displayOptions}
          onSearch={setSearchQuery}
          onSelect={handleSelect}
          value={searchQuery}
          className="search-autocomplete"
          allowClear={false}
        >
          <div className="search-bar-wrapper">
            <Input
              addonBefore={<SearchOutlined />}
              addonAfter={
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <Space
                    size="middle"
                    className="user-info"
                    style={{ cursor: "pointer" }}
                  >
                    <Text>{user.name}</Text>
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      src={user.avatarUrl}
                    />
                  </Space>
                </Dropdown>
              }
              placeholder="Поиск по приложению..."
              allowClear
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
          </div>
        </AutoComplete>
        {/* <Input
          addonBefore={<SearchOutlined />}
          addonAfter={
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Space
                size="middle"
                className="user-info"
                style={{ cursor: "pointer" }}
              >
                <Text>{user.name}</Text>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user.avatarUrl}
                />
              </Space>
            </Dropdown>
          }
          placeholder="Поиск по приложению..."
          allowClear
          size="large"
          onSearch={handleSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        /> */}
      </div>
    );
  }
};

export default AppHeader;
