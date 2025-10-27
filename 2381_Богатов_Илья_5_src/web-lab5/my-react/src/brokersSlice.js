import { createSlice } from "@reduxjs/toolkit";

// Инициализация начального состояния
const initialState = {
    brokersList: []
};

// Создание среза состояния с помощью createSlice
export const brokersSlice = createSlice({
    name: "brokers", // Имя среза, используемое в хранилище Redux
    initialState,
    reducers: {
        // установка начального списка брокеров
        setInitialBrokers: (state, action) => {
            state.brokersList = action.payload;
        },
        // добавление нового брокера
        addBroker: (state, action) => {
            state.brokersList.push(action.payload);
        },
        // удаление брокера по ID
        deleteBroker: (state, action) => {
            state.brokersList = state.brokersList.filter(
                (broker) => broker.id !== action.payload
            );
        },
        // обновление капитала брокера
        updateBrokerCash: (state, action) => {
            const { id, money } = action.payload;
            const broker = state.brokersList.find((broker) => broker.id === id);
            if (broker) {
                broker.money = money;
            }
        }
    }
});

export const {
    setInitialBrokers,
    addBroker,
    deleteBroker,
    updateBrokerCash
} = brokersSlice.actions;

export default brokersSlice.reducer;
