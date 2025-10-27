<template>
  <div class="exchange-date">
    <p>Дата торгов: {{dateOfExchange}}</p>
  </div>
  <div class="stock-row" v-for="(value, key) in lastPrices" :key="key" :id="key">
    <div class="stock-info">
      <p class="symbol">{{key}}</p>
      <p class="price">{{value}}$</p>
      <p class="owned" :id="key">Имеется: {{calculateDiff(key)}}</p>
    </div>
    <div class="stock-buy">
      <input class="qty" type="number" min="1" :id="key + '-input'" value="1"/>
      <div class="actions">
        <button class="btn primary" @click="buyStocks" :id="key">Купить</button>
        <button class="btn danger" @click="saleStocks" :id="key">Продать</button>
      </div>
    </div>
    <div class="stock-chart">
      <BarChart :chartData="parseData(key)" :options="chartOptions"/>
    </div>
  </div>

</template>

<script>
  import socket from '../socket.js';
  import {toRaw} from 'vue';
  import BarChart from './Chart.vue'  // Импорт компонента диаграммы

  export default {
    name: 'StockExchange',  // Имя компонента
    components: {BarChart},  // Регистрация компонента диаграммы

    mounted() {
      socket.on("connect", () => {
        console.log("vue connected in exchange.vue");
      })

      socket.on("Sale", (data) => {
        let stocksData = JSON.parse(data);
        this.stockData = stocksData;

        // Получение даты последней сделки
        let stocksList = Object.keys(stocksData);
        this.dateOfExchange = stocksData[stocksList[0]][stocksData[stocksList[0]].length - 1].date;

        // Обновление цен акций
        let lastPrice = {};
        for (let stock of stocksList) {
          lastPrice[stock] = stocksData[stock][stocksData[stock].length - 1].price;
        }

        this.lastPrices = lastPrice;
      })
    },

    data () {
      return {
        dateOfExchange: 'Ожидание старта торгов...',
        lastPrices: {},
        stockData: {},
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
          },
        }
      }
    },

    methods: {
      calculateDiff(stockSymbol) {
        let userStocks = toRaw(this.$store.getters.getStocks); // Получение текущих акций пользователя
        console.log('userStocks = ', userStocks);
        let stockIDX = userStocks.findIndex(e => e.symbol === stockSymbol);

        if (stockIDX === -1 || userStocks[stockIDX].count === 0) {
          return "0";
        }

        // diff - это выигрыш, сколько стоит текущее количество акций пользователя минус сколько он потратил на покупку,
        // то есть если diff=-12, то пользователь теряет 12$
        let diff = this.lastPrices[stockSymbol] * userStocks[stockIDX].count - userStocks[stockIDX].spent;
        return userStocks[stockIDX].count + '(' + diff.toFixed(2) +')';
        /*
        this.lastPrices[stockSymbol]: текущая цена акции
        userStocks[stockIDX].count: количество акций у пользователя
        userStocks[stockIDX].spent: сумма, потраченная на покупку акций
        */
      },

      saleStocks(e) {
        let symbolStock = e.target.id;
        let input = document.getElementById(symbolStock+'-input');
        let cnt = Number(input.value);
        let price = this.lastPrices[symbolStock];
        let userStocks = toRaw(this.$store.getters.getStocks);
        let stockIDX = userStocks.findIndex(e => e.symbol === symbolStock);

        if (Number.isNaN(cnt) || cnt <= 0) {
          alert("Некорректные данные!");
          return;
        }

        if (stockIDX === -1 || cnt > userStocks[stockIDX].count) {
          alert("Недостаточно акций!");
          return;
        }

        let sendData = {
          symbol: symbolStock,
          count: cnt,
          price: price.toFixed(2),
          id: this.$store.getters.getId
        }

        console.log('sendData from saleStock = ', sendData);

        const base = process.env.VUE_APP_API_URL || 'http://localhost:3001';
        const isDevServer = typeof window !== 'undefined' && window.location && window.location.port === '8081';
        const url = isDevServer ? '/api/saleStocks' : (base + '/saleStocks');
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(sendData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(value => {
              this.$store.commit('SET_STOCKS', value.stocks);
              this.$store.commit('SET_BALANCE', value.money);
              
            })
            .catch(err => {
              console.error('saleStocks error:', err);
              alert('Нет соединения с сервером (saleStocks). Проверь backend ' + base);
            })

      },

      buyStocks(e) {
        let symbolStock = e.target.id;
        let input = document.getElementById(symbolStock+'-input');
        let cnt = Number(input.value);
        let price = this.lastPrices[symbolStock];

        if(Number.isNaN(cnt) || cnt <= 0) {
          alert('Некорректные данные!');
          return;
        }

        if (price * cnt > this.$store.getters.getBalance) {
          alert("Недостаточно денег!!!");
          return;
        }

        let sendData = {
          symbol: symbolStock,
          count: cnt,
          price: price.toFixed(2),
          id: this.$store.getters.getId
        }

        console.log('sendData from buyStock = ', sendData);

        const base = process.env.VUE_APP_API_URL || 'http://localhost:3001';
        const isDevServer = typeof window !== 'undefined' && window.location && window.location.port === '8081';
        const url = isDevServer ? '/api/buyStocks' : (base + '/buyStocks');
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(sendData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => response.json())
            .then(value => {
              this.$store.commit('SET_BALANCE', value.money);
              this.$store.commit('SET_STOCKS', value.stocks);
            })
            .catch(err => {
              console.error('buyStocks error:', err);
              alert('Нет соединения с сервером (buyStocks). Проверь backend ' + base);
            })
      },

      // Парсинг данных для отображения на диаграмме
      parseData(stockSymbol) {
        let Rdata = toRaw(this.stockData);
        let labels = [];
        let values = [];

        for (let i=0; i < Rdata[stockSymbol].length; i++) {
          labels.push(Rdata[stockSymbol][i].date);
          values.push(Rdata[stockSymbol][i].price);
        }

        return {
          labels: labels,
          datasets: [{
            data: values,
            label: stockSymbol,
            borderColor: 'rgb(235, 86, 0)'
          }]
        }
      }
    },

    computed: {
      getFullName () {return this.$store.getters.getFullName},
    }
  }
</script>

<style scoped>
  :root {
    --text: #fff;
    --panel: #2f343a;
    --muted: #4b5154;
    --accent: #059669;
    --success: #059669;
    --danger: #dc2626;
  }

  .exchange-date{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 960px;
    margin: 8px auto 16px;
    color: var(--text);
    border-radius: 6px;
    border: 1px solid var(--muted);
    border-left: 4px solid var(--accent);
    background: transparent;
    padding: 8px 12px;
    font-size: 18px;
  }

  .stock-row{
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 12px;
    align-items: stretch;
    width: 100%;
    max-width: 960px;
    margin: 12px auto;
  }

  .stock-info{
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 12px;
    align-items: center;
    color: var(--text);
    border-radius: 6px;
    background: var(--panel);
    border: 1px solid var(--muted);
    padding: 8px 12px;
  }

  .stock-info .symbol{ font-weight: 700; }
  .stock-info .price{ opacity: .9; }
  .stock-info .owned{ opacity: .8; }

  .stock-buy{
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--muted);
    border-radius: 6px;
    background: transparent;
    padding: 8px 10px;
  }

  .stock-buy .qty{
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--muted);
    border-radius: 6px;
    padding: 6px 8px;
  }

  .actions{ display: flex; gap: 8px; }
  .btn{ border: none; border-radius: 6px; padding: 8px 10px; color: #fff; cursor: pointer; }
  .btn.primary{ background: var(--success); }
  .btn.primary:hover{ background: #059669; }
  .btn.danger{ background: var(--danger); }
  .btn.danger:hover{ background: #dc2626; }

  .stock-chart{
    grid-column: 1 / -1;
    height: 260px;
  }
</style>