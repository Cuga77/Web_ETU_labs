import { configureStore } from "@reduxjs/toolkit";
import brokersReducer from "./brokersSlice";

export const store = configureStore({
    reducer: {
        brokers: brokersReducer, // Регистрация редьюсера брокеров под ключом `brokers`
    }
});
