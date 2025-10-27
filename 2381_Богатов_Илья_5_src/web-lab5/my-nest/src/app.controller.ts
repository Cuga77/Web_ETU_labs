import {Controller, Get, Post, Req} from '@nestjs/common';
import {readFileSync, writeFileSync} from 'fs';
import {SocketService} from './socket.service';
import {IUser, IStock} from "./interface";

// Определение контроллера для обработки HTTP-запросов
@Controller()
export class AppController {
    index: number = 0;  // Индекс текущей записи акций
    interval: any;  // Переменная для хранения таймера
    constructor(private socketService: SocketService) {}

    // Получение списка брокеров
    @Get("brokers")
    GetUsers(@Req() req: Request): IUser[] {
        return JSON.parse(readFileSync('./data/brokers-list.json', 'utf8'));
    }

    // Добавление нового брокера
    @Post("connectNewBroker")
    PostConnectNewBroker(@Req() req: Request): IUser[] {
        let users = JSON.parse(readFileSync('./data/brokers-list.json', 'utf8'));
        let newBroker = JSON.parse(JSON.stringify(req.body));
        users.Brokers.push(newBroker);
        writeFileSync('./data/brokers-list.json', JSON.stringify(users));
        console.log('users', users);
        return users;
    }

    // Удаление брокера
    @Post('deleteBroker')
    PostDeleteBroker(@Req() req : Request) : IUser[]{
        let users = JSON.parse(readFileSync('./data/brokers-list.json', 'utf8'));
        let id = JSON.parse(JSON.stringify(req.body)).id;
        id = users.Brokers.findIndex((event: { id: any; }) => event.id == id);
        users.Brokers.splice(id, 1);
        writeFileSync('./data/brokers-list.json', JSON.stringify(users));
        return users;
    }

    // Обновление списка брокеров
    @Post('updateBrokersList')
    PostUpdateBrokersList(@Req() req : Request): void {
        let users = JSON.parse(readFileSync('./data/brokers-list.json', 'utf8'));
        users.Brokers = req.body;
        writeFileSync('./data/brokers-list.json', JSON.stringify(users));
    }

    @Get('stocks')
    GetStocks(@Req() req : Request): IStock[] {
        return JSON.parse(readFileSync('./data/stocks-list.json', "utf-8"));

    }

    @Post('showStocks')
    PostShowStocks(@Req() req : Request): any {
        let symbol = JSON.parse(JSON.stringify(req.body)).symbol;
        let dataOfStockPrice = JSON.parse(readFileSync('./data/companies/' + symbol + '.json', 'utf8'));
        let labels = [];
        let values = [];
        for (let i = dataOfStockPrice.data.length - 1; i >= 0; i--) {
            labels.push(dataOfStockPrice.data[i].date);
            values.push(dataOfStockPrice.data[i].price);
        }
        let data = {
            labels: labels,
            values: values
        };

        console.log(data);
        return JSON.stringify(data);
    }

    @Post('stopSale')
    PostStopSale(@Req() req : Request): any {
        clearInterval(this.interval);
        this.interval = undefined;
        this.index = 0;
        console.log('Конец торгов!');
        this.socketService.BroadCast('SaleStopped', { stopped: true });
    }

    @Post('startSale')
    PostStartSale(@Req() req : Request): any {
        let data = JSON.parse(JSON.stringify(req.body));
        let dataOfStockPrice = {};
        let startDateSplit = data.startDate.split('-');
        let startDateCorrect = startDateSplit[1] + '/' + startDateSplit[2] + '/' + startDateSplit[0];
        let sendSaleInfo = {};
        let speed = Number(data.changeSpeed);
        if (Number.isNaN(speed)) speed = 1;
        if (speed < 1) speed = 1;
        if (speed > 100) speed = 100;

        // Если уже был активный интервал — перезапускаем с новой скоростью
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }

        for (let stockSymbol of data.stocks) {
            sendSaleInfo[stockSymbol] = [];
            let stockData = JSON.parse(readFileSync('./data/companies/' + stockSymbol + '.json', 'utf8')).data;
            let id = stockData.findIndex((e: { date: string; }) => e.date == startDateCorrect);
            // Если точной даты нет (например, раньше 12/09/2019), стартуем с самой ранней доступной точки
            if (id === -1) {
                id = stockData.length - 1; // оставить весь массив
            }
            stockData.splice(id + 1);
            stockData.reverse();
            dataOfStockPrice[stockSymbol] = stockData;
        }

        this.index = 0;
        this.interval = setInterval(() => {
            // Если данные закончились для любого тикера — остановить торги
            let hasData = true;
            for (let stockSymbol of data.stocks) {
                if (!dataOfStockPrice[stockSymbol] || !dataOfStockPrice[stockSymbol][this.index]) {
                    hasData = false;
                    break;
                }
            }
            if (!hasData) {
                clearInterval(this.interval);
                this.interval = undefined;
                console.log('Конец торгов! (данные закончились)');
                this.socketService.BroadCast('SaleStopped', { stopped: true });
                return;
            }

            for (let stockSymbol of data.stocks) {
                sendSaleInfo[stockSymbol].push(dataOfStockPrice[stockSymbol][this.index]);
            }
            this.index++;
            this.socketService.BroadCast('Sale', sendSaleInfo);
        }, speed * 1000);
    }

    @Post('buyStocks')
    PostBuyStocks(@Req() req : Request): any {
        let data = JSON.parse(JSON.stringify(req.body));
        let users = JSON.parse(readFileSync('./data/brokers-list.json', "utf-8"));
        let idx = users.Brokers.findIndex(e => e.id == data.id);
        let stockIDX = users.Brokers[idx].stocks.findIndex(e => e.symbol == data.symbol);

        // если пользователь купил акцию, которой у него до этого не было
        if (stockIDX == -1) {
            let newStock = {
                symbol: data.symbol,
                count: data.count,
                spent: data.price * data.count
            };
            users.Brokers[idx].stocks.push(newStock);
        }
        else {
            users.Brokers[idx].stocks[stockIDX].count += data.count;
            users.Brokers[idx].stocks[stockIDX].spent = users.Brokers[idx].stocks[stockIDX].count * data.price;
        }

        users.Brokers[idx].money -= data.count * data.price;
        writeFileSync('./data/brokers-list.json', JSON.stringify(users));
        return users.Brokers[idx];
    }

    @Post('saleStocks')
    PostSaleStocks(@Req() req : Request): any {
        let data = JSON.parse(JSON.stringify(req.body));
        let users = JSON.parse(readFileSync('./data/brokers-list.json', "utf-8"));
        let idx = users.Brokers.findIndex(e => e.id == data.id);
        let stockIDX = users.Brokers[idx].stocks.findIndex(e => e.symbol == data.symbol);

        if (stockIDX == -1) {
            return users.Brokers[idx];
        }
        else {
            users.Brokers[idx].stocks[stockIDX].count -= data.count;
            users.Brokers[idx].stocks[stockIDX].spent = users.Brokers[idx].stocks[stockIDX].count * data.price;
        }

        users.Brokers[idx].money += data.count * data.price;
        writeFileSync('./data/brokers-list.json', JSON.stringify(users));
        return users.Brokers[idx];
    }
}