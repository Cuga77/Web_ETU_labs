<template>
  <div v-for="broker in brokersList" :key="broker.id">
    <div class="broker">
      <p class="name">{{broker.fullName}}</p>
      <p class="money">{{broker.money}}$</p>
    </div>
    <div class="broker-stocks">
      <div class="stock" v-for="stocks in broker.stocks" :key="stocks.symbol">
        <span class="sym">{{stocks.symbol}}</span>
        <span class="val">{{calculateDiff(stocks.symbol, broker.stocks)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import socket from "../socket.js";
  export default {
    name: "AdminPanel",
    mounted() {
      this.getBrokers();

      socket.on("connect", () => {
        console.log("vue connected");
      })

      socket.on("Sale", (data) => {
        let stocksData = JSON.parse(data);
        let stocksList = Object.keys(stocksData);
        let lastPrice = {};
        for (let stock of stocksList) {
          lastPrice[stock] = stocksData[stock][stocksData[stock].length - 1].price;
        }
        this.lastPrice = lastPrice;
      })
    },
    data() {
      return {
        brokersList: [],
        lastPrice: {}
      }
    },
    methods: {
      calculateDiff (stockSymbol, userStocks) {
        let stockIDX = userStocks.findIndex(e => e.symbol === stockSymbol);
        if (stockIDX === -1 || userStocks[stockIDX].count === 0) {
          return "0";
        }
        let diff = this.lastPrice[stockSymbol] * userStocks[stockIDX].count - userStocks[stockIDX].spent;
        diff = diff.toFixed(2);
        return userStocks[stockIDX].count + ' (' + diff +')';
      },
      getBrokers () {
        fetch('http://localhost:3001/brokers', {method: 'GET'})
            .then(response => response.json())
            .then(value => this.brokersList = value.Brokers)
            .catch(error => console.log("vue get Brokers error: ", error));
      }

    }
  }
</script>


<style scoped>
  :root {
    --text: #fff;
    --panel: #333;
    --muted: #666;
  }

  .broker{
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
    width: 100%;
    max-width: 960px;
    margin: 12px auto 6px;
    color: var(--text);
    border-radius: 6px;
    background: var(--panel);
    border: 1px solid var(--muted);
    padding: 10px 12px;
  }

  .broker .name{ font-weight: 700; }
  .broker .money{ opacity: .9; }

  .broker-stocks{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
    width: 100%;
    max-width: 960px;
    margin: 0 auto 16px;
    color: var(--text);
  }

  .broker-stocks .stock{
    display: flex;
    justify-content: space-between;
    padding: 6px 8px;
    border: 1px solid var(--muted);
    border-radius: 6px;
    background: transparent;
  }

  .sym{ font-weight: 600; }
  .val{ opacity: .9; }
</style>