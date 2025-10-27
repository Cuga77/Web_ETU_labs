import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBroker, deleteBroker, updateBrokerCash, setInitialBrokers } from "./brokersSlice";
import './app.brokers.css';

export default function Brokers() {
    // Доступ к состоянию брокеров из Redux
    const brokersList = useSelector((state) => state.brokers.brokersList);
    const dispatch = useDispatch();  // Функция для отправки действий в Redux

    // Локальные состояния для формы добавления брокеров
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [startCash, setStartCash] = useState("");

    // Загрузка брокеров с сервера при монтировании компонента
    useEffect(() => {
        fetch("http://localhost:3001/brokers")
            .then((response) => response.json())
            .then((data) => dispatch(setInitialBrokers(data.Brokers)))// Обновление Redux состояния
            .catch((err) => console.error("Ошибка загрузки брокеров:", err));
    }, [dispatch]); // Зависимость - вызов произойдет только при первом монтировании

    // Проверка ввода данных
    const handleBrokerDataChange = (e) => {
        const { id, value } = e.target;

        if (id === "startCash" && (isNaN(value) || value < 0)) {
            alert("Некорректные данные: стартовый капитал должен быть положительным числом!");
            return;
        }

        switch (id) {
            case "name":
                setName(value);
                break;
            case "surname":
                setSurname(value);
                break;
            case "startCash":
                setStartCash(value);
                break;
            default:
                break;
        }
    };

    // Добавление нового брокера
    const handleAddBroker = () => {
        if (!name || !surname || startCash === "" || Number(startCash) < 0) {
            alert("Пожалуйста, введите корректные данные!");
            return;
        }

        const newBroker = {
            id: brokersList.length > 0 ? brokersList[brokersList.length - 1].id + 1 : 1,
            fullName: `${surname} ${name}`,
            money: Number(startCash) || 0,
            stocks: []
        };

        // Отправка нового брокера на сервер
        fetch("http://localhost:3001/connectNewBroker", {
            method: "POST",
            body: JSON.stringify(newBroker),
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.json())
            .then((data) => dispatch(setInitialBrokers(data.Brokers)))
            .catch((err) => console.error("Ошибка добавления брокера:", err));

        setName("");
        setSurname("");
        setStartCash("");
    };

    // Обновление капитала брокера
    const handleCashChange = (e, id) => {
        const newValue = e.target.value === "" ? 0 : Number(e.target.value);

        if (isNaN(newValue) || newValue < 0) {
            alert("Некорректные данные: введите положительное число!");
            return;
        }
// Отправка обновленных данных на сервер
        fetch("http://localhost:3001/updateBrokersList", {
            method: "POST",
            body: JSON.stringify(
                brokersList.map((broker) =>
                    broker.id === id ? { ...broker, money: newValue } : broker
                )
            ),
            headers: { "Content-Type": "application/json" }
        })
            .then(() => dispatch(updateBrokerCash({ id, money: newValue })))
            .catch((err) => console.error("Ошибка обновления капитала брокера:", err));
    };

    // Удаление брокера
    const handleDeleteBroker = (id) => {
        fetch("http://localhost:3001/deleteBroker", {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" }
        })
            .then(() => dispatch(deleteBroker(id)))  // Обновление Redux состояния
            .catch((err) => console.error("Ошибка удаления брокера:", err));
    };

    return (
        <div className="main-div">
            <div className="brokers-list">
                {brokersList.map((broker) => (
                    <div className="broker" key={broker.id}>
                        <span className="broker-name">{broker.fullName}</span>
                        <div className="broker-cash">
                            <input
                                className="input"
                                value={broker.money}
                                onChange={(e) => handleCashChange(e, broker.id)}
                            />
                            <button onClick={() => handleDeleteBroker(broker.id)}>
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-broker">
                <p>Имя:</p>
                <input id="name" value={name} onChange={handleBrokerDataChange} />
                <p>Фамилия:</p>
                <input id="surname" value={surname} onChange={handleBrokerDataChange} />
                <p>Стартовый капитал:</p>
                <input id="startCash" value={startCash} onChange={handleBrokerDataChange} />
                <button onClick={handleAddBroker}>Добавить брокера</button>
            </div>
        </div>
    );
}
