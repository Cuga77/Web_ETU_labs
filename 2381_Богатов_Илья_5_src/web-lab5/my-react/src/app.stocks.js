import React, {Component} from "react";
import {Chart} from "chart.js/auto";
import "./app.stocks.css"

export default class Stocks extends Component {
    constructor(props) {
        super(props);
        this.state = {stocksList: [], selectedSymbol: null}
    }

    componentDidMount() {
        fetch('http://localhost:3001/stocks', {method: 'GET'})
            .then(response => response.json())
            .then(value => this.setState({ stocksList: value.Stocks }))
            .catch(error => console.log("stock error: ", error));
    }

    showStocks = (event) => {
        // Очистить правую колонку и отрисовать контент
        const right = document.getElementById('stocks-right');
        right.innerHTML = '';

        const symbol = event.target.id;
        this.setState({ selectedSymbol: symbol });
        const data = { symbol };

        fetch("http://localhost:3001/showStocks", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(value => {
            let div = document.createElement('div');
            div.classList.add('chart-plus-table-div');
            right.appendChild(div);

            // Создание элемента canvas для отображения графика
            let canvas = document.createElement('canvas');
            canvas.classList.add('diag-chart');
            canvas.width = 500;
            canvas.height = 400;
            div.appendChild(canvas);

            // Формирование данных для графика
            const canvasData = {
                labels: value.labels,
                datasets: [{
                    label: event.target.id,
                    backgroundColor: 'rgb(0, 102, 255)',
                    borderColor: 'rgb(0, 102, 255)',
                    data: value.values,
                }]
            };

            const myChart = new Chart(canvas, {
                type: 'line',
                data: canvasData,
                options: {
                    plugins: { legend: { labels: { color: '#cbd5e1' } } },
                    scales: {
                        x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
                        y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
                    }
                }
            });

            // Создание таблицы для отображения значений
            let table = document.createElement('table');
            let div2 = document.createElement('div');
            div2.classList.add('diag-table-div');
            div.appendChild(div2);
            table.classList.add('diag-table');

            // Заголовок таблицы
            let header = table.createTHead();
            let headerRow = header.insertRow();
            let h1 = document.createElement('th');
            h1.classList.add('diag-table-cell');
            h1.textContent = 'Дата';
            let h2 = document.createElement('th');
            h2.classList.add('diag-table-cell');
            h2.textContent = 'Цена';
            headerRow.appendChild(h1);
            headerRow.appendChild(h2);

            let tbody = table.createTBody();
            for (let i = 0; i < value.labels.length; i++) {
                let row = tbody.insertRow();
                let cell = row.insertCell();
                cell.classList.add('diag-table-cell');
                cell.textContent = value.labels[i];
                cell = row.insertCell();
                cell.classList.add('diag-table-cell');
                cell.textContent = value.values[i] + '$';
            }
            div2.appendChild(table);
        });
    }

    render() {
        return (
            <div className="stocks-page">
                <div className="stocks-left">
                    {this.state.stocksList.map(stock => (
                        <p className={`stock-div ${this.state.selectedSymbol===stock.symbol ? 'selected' : ''}`} id={stock.symbol} onClick={this.showStocks} key={stock.symbol}>{stock.symbol} - {stock.company}</p>
                    ))}
                </div>
                <div className="stocks-right" id="stocks-right">
                    {/* Контент выбранной акции (график+таблица) будет монтироваться сюда */}
                </div>
            </div>
        );
    }
}