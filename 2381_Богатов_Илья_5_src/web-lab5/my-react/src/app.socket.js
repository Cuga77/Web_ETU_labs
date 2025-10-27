import io, {Socket} from 'socket.io-client'

export default class SocketService {
    static socket = null;

    static CreateConnection() {
        this.socket = io('http://localhost:3001');  // Инициализация сокета, подключение к серверу по указанному адресу

        this.socket.on('connection', (socket) => {
            console.log('React connected');
        })
    }

    // Метод для отправки данных о новом брокере на сервер
    static connectNewBroker(name, surname, startCash) {
        let newBroker = {
            id: 0,
            fullName: surname + " " + name,
            money: startCash,
            stocks: [{}]
        }
        // Отправка данных о новом брокере на сервер через событие 'connectNewBroker'
        this.socket.emit('connectNewBroker', ({"newBroker": newBroker}));
    }
}