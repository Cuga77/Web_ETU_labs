import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";   // Для подключения Redux
import { store } from "./store";          // Хранилище Redux

import Header from "./app.header";
import StartPage from "./app.startPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Brokers from "./app.brokers";
import Stocks from "./app.stocks";
import Exchange from "./app.exchange";

// Создание маршрутизатора
const router = createBrowserRouter([
    {
        path: "/",
        element: <StartPage />,
    },
    {
        path: "/brokers",
        element: <Brokers />,
    },
    {
        path: "/stocks",
        element: <Stocks />,
    },
    {
        path: "/exchange",
        element: <Exchange />,
    }
]);

// Рендер приложения
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>  {/* Подключение хранилища */}
            <Header />
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
