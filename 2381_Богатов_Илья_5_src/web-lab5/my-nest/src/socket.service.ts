import {OnGatewayConnection, WebSocketGateway} from "@nestjs/websockets";

// Создание WebSocket-шлюза с поддержкой CORS-запросов от любого источника
@WebSocketGateway({cors: {origin: "*"}})
export class SocketService implements OnGatewayConnection {
    clients: any = []; // Массив для хранения подключенных клиентов

    // Обработка подключения клиента
    handleConnection(user: any) {
        console.log("user connected");
        this.clients.push(user);
    }

    // Обработка отключения клиента
    handleDisconnect(user: any) {
        for (let i=0; i<this.clients.length; i++) {
            if (this.clients[i] === user) {
                this.clients.splice(i, 1);
                return;
            }
        }
    }

    // Широковещательная отправка сообщения всем подключенным клиентам
    BroadCast(event: string, message: any) {
        const broadcastMessage = JSON.stringify(message);
        for (let client of this.clients) {
            client.emit(event, broadcastMessage);
        }
    }

}