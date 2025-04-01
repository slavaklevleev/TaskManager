import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <BrowserRouter>
    <ConfigProvider
      locale={ruRU}
      theme={{
        components: {
          Menu: {
            iconSize: 20,
            horizontalLineHeight: '100%',
            fontSize: 20,
            itemHeight: 60,
            iconMarginInlineEnd: 14,
            itemMarginInline: 15
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  </BrowserRouter>
);
