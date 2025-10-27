import { Module } from '@nestjs/common';
import {AppController} from './app.controller';
import {SocketService} from "./socket.service";

@Module({  //  базовый декоратор, используемый для создания модулей
    imports: [],
    controllers: [AppController],
    providers: [SocketService],
})
export class AppModule {}