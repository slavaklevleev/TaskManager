import "./App.css";
import { Layout, Menu } from "antd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Sider from "antd/es/layout/Sider";
import {
  CalendarFilled,
  CheckSquareOutlined,
  FileTextOutlined,
  HomeFilled,
  HomeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Habits from "./pages/Habits";
import NotesPage from "./pages/Notes";
import SchedulePage from "./pages/SchedulePage";
import PrivateRoute from "./pages/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppHeader from "./components/AppHeader";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const { Header, Content, Footer } = Layout;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
};
const contentLayoutStyle = {
  minHeight: 120,
  lineHeight: "120px",
  color: "#000",
  borderRadius: "10px",
  margin: "16px",
  padding: "15px",
};
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  background: "none",
};
const layoutStyle = {
  overflow: "hidden",
  height: "100vh",
  backgroundColor: "#5F4AC6",
};

const items = [
  {
    key: "/",
    icon: <HomeFilled />,
    label: "Домой",
  },
  {
    key: "/schedule",
    icon: <CalendarFilled />,
    label: "Расписание",
  },
  {
    key: "/tasks",
    icon: <UnorderedListOutlined />,
    label: "Задачи",
  },
  {
    key: "/habits",
    icon: <CheckSquareOutlined />,
    label: "Привычки",
  },
  {
    key: "/notes",
    icon: <FileTextOutlined />,
    label: "Заметки",
  },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (menu) => {
    navigate(menu.key);
  };

  const { logout, isAuthenticated } = useContext(AuthContext);

  return (
    // <SchedulePage/>
    <Layout style={layoutStyle}>
      <Sider width="15%" style={siderStyle}>
        <Menu
          mode="vertical"
          items={items}
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
          className="custom-menu"
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>
      <Layout style={contentLayoutStyle}>
        {isAuthenticated && (<Header style={{ background: "none", padding: "0 20px" }}><AppHeader /></Header>)}
        <Content style={{ overflow: "auto", padding: "20px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute>
                  <SchedulePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/habits"
              element={
                <PrivateRoute>
                  <Habits />
                </PrivateRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <PrivateRoute>
                  <NotesPage />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
