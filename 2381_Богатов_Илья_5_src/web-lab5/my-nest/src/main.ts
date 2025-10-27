import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import cors from "cors-ts";

async function bootstrap() {
    // Создание экземпляра приложения на основе основного модуля `AppModule`
    const app = await NestFactory.create(AppModule);

    // Настройка CORS для разрешения запросов с указанных источников
    app.use(
        cors({
            origin: ['http://localhost:3000', 'http://localhost:8080'],
            optionsSuccessStatus: 200,
        })
    )
    // Запуск приложения на порту 3001
    await app.listen(3001);
}

bootstrap()
    .catch((err) => {console.log("error while loading", err)});