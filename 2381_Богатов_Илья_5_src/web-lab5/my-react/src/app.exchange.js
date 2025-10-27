import React, {Component} from "react";
import {Chart} from "chart.js/auto";
import SocketService from "./app.socket";
import './app.exchange.css'

export default class Exchange extends Component{
    constructor(props) {
        super(props);
        // Дата по умолчанию: год назад от текущего дня
        const now = new Date();
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const pad = (n) => String(n).padStart(2, '0');
        const defaultDate = `${yearAgo.getFullYear()}-${pad(yearAgo.getMonth()+1)}-${pad(yearAgo.getDate())}`;
        this.state = {stocksList: [], startDate: defaultDate, changeSpeed: 1, running: false};
        this.chart = null;
        this.selectedSymbols = [];
    }

    componentDidMount() {
        SocketService.CreateConnection();
        fetch('http://localhost:3001/stocks', {method: 'GET'})
            .then(response => response.json())
            .then(value => this.setState({ stocksList: value.Stocks }))
            .catch(error => console.log("stocks exchange error: ", error));

        SocketService.socket.on('Sale', (Kdata) => {
            if (!this.state.running) this.setState({running: true});
            let Rdata = JSON.parse(Kdata);
            console.log('Rdata = ', Rdata);
            // Соберем labels по первой выбранной акции
            const symbols = this.selectedSymbols.length ? this.selectedSymbols : Object.keys(Rdata);
            if (symbols.length === 0) return;
            const sample = Rdata[symbols[0]] || [];
            const labels = sample.map(p => p.date);

            // Подготовим данные для datasets
            const datasets = symbols.map((sym, idx) => {
                const values = (Rdata[sym] || []).map(p => p.price);
                const color = ['#60a5fa','#34d399','#f472b6','#f59e0b','#a78bfa','#22d3ee', '#7ca333ff', '#cc0000', '#096609ff', '#00cc00'][idx % 8];
                return {
                    label: sym,
                    data: values,
                    borderColor: color,
                    backgroundColor: color,
                    pointRadius: 0,
                    borderWidth: 2
                };
            });

            // Создадим график один раз и дальше только обновляем
            const container = document.querySelector('.chart-diag-div');
            if (!this.chart) {
                const canvas = document.createElement('canvas');
                canvas.id = 'trade-chart';
                canvas.classList.add('chart-diag');
                container.innerHTML = '';
                container.appendChild(canvas);
                this.chart = new Chart(canvas, {
                    type: 'line',
                    data: { labels, datasets },
                    options: {
                        animation: false,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { labels: { color: '#cbd5e1' } } },
                        scales: {
                            x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
                            y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
                        }
                    }
                });
            } else {
                this.chart.data.labels = labels;
                // Синхронизировать наборы
                this.chart.data.datasets = datasets;
                this.chart.update('none');
            }
        })

        SocketService.socket.on('SaleStopped', () => {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            } else {
                document.querySelectorAll('.chart-diag').forEach(el => el.remove());
            }
            this.setState({running: false});
        });
    }

    changeExchangeData = (event) => {
        switch(event.target.id) {
            case "startDate":
                this.setState({startDate: event.target.value});
                break;
            case "changeSpeed":
                if ((Number.isNaN(Number(event.target.value)))) {
                    alert("Некорректные данные: это не число!");
                    break;
                }
                else if (event.target.value < 0 || event.target.value > 100) {
                    alert("Некорректные данные: скорость должна лежать в диапазоне от 0 до 100!");
                    break;
                }
                else if (event.target.value === "") {
                    this.setState({changeSpeed: 0});
                }
                else {
                    this.setState({changeSpeed: Number(event.target.value)});
                }
                break;
            default:
                break;
        }
    }

    startSale = () => {
        const selectedStocks = [];
        const stocks = Array.from(document.getElementsByClassName('stocks'));
        console.log('stocks: ', stocks);
        stocks.forEach(stock => {
            if (stock.checked) {
                selectedStocks.push(stock.value);
            }
        });
        if (selectedStocks.length === 0) {
            alert('Выберите хотя бы одну акцию');
            return;
        }

        // Очистить графики перед стартом
        if (this.chart) { this.chart.destroy(); this.chart = null; }
        document.querySelectorAll('.chart-diag').forEach(el => el.remove());
        this.selectedSymbols = selectedStocks;

        let data = {
            startDate: this.state.startDate,
            changeSpeed: Number(this.state.changeSpeed),
            stocks: selectedStocks
        };

        fetch("http://localhost:3001/startSale", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
            .then(() => this.setState({running: true}))
            .catch(error => console.log("stocks start exchange error: ", error));
    }

    stopSale = () => {
        fetch("http://localhost:3001/stopSale", {method: 'POST'})
            .catch(error => console.log("stocks stop exchange error: ", error));
    }

    selectAll = () => {
        const stocks = Array.from(document.getElementsByClassName('stocks'));
        stocks.forEach(chk => chk.checked = true);
    }

    selectNone = () => {
        const stocks = Array.from(document.getElementsByClassName('stocks'));
        stocks.forEach(chk => chk.checked = false);
    }

    render() {
        return (
            <div className="main-div">
                <div className="exchange-start">
                    <p>Дата начала торгов:</p>
                    <input type="date" id="startDate" value={this.state.startDate} onChange={this.changeExchangeData}/>
                    <p>Скорость торгов:</p>
                    <input id="changeSpeed" type="number" min="0" max="100" step="0.1" placeholder="сек/шаг" value={this.state.changeSpeed} onChange={this.changeExchangeData}/>
                    <form className="stocks-list">
                        {this.state.stocksList.map(stock => (
                            <label key={stock.symbol}>
                                <input type="checkbox" className="stocks" value={stock.symbol}/>
                                {stock.symbol}
                            </label>
                        ))}
                    </form>
                    <div style={{marginBottom:"8px"}}>
                        <button onClick={this.selectAll} disabled={this.state.running}>Выбрать все</button>
                        <button onClick={this.selectNone} disabled={this.state.running} style={{marginLeft:"6px", background:'#6b7280'}}>Снять выбор</button>
                    </div>
                    <div style={{marginBottom:"8px", color:'#9ca3af'}}>
                        Статус: {this.state.running ? 'идут торги' : 'остановлено'}
                    </div>
                    <div className="button">
                        <button onClick={this.startSale} disabled={this.state.running}>Начать торги</button>
                        <button onClick={this.stopSale} disabled={!this.state.running}>Закончить торги</button>
                    </div>
                </div>
                <div className="chart-diag-div"></div>
            </div>
        )
    }
}