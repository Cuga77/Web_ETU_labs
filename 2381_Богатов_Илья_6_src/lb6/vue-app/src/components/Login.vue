<template>
  <div class="login">
    <label>Фамилия</label>
    <input type="text" v-model="surname"/>
    <label>Имя</label>
    <input type="text" v-model="name"/>
    <div class="admin">
      <input id="adminRoot" type="checkbox" v-model="adminRoot" />
      <label for="adminRoot">Права администратора</label>
    </div>
    <button class="button primary" @click="checkBrokerInList" :disabled="loading">Войти</button>
    <p v-if="errorText" class="error">{{ errorText }}</p>
  </div>
</template>

<script>
  export default {
    name: 'LoginComponent',
    mounted() {
      this.getBrokers();
    },

    data() {
      return {
        surname: '',
        name: '',
        adminRoot: false,
        balance: 0,
        brokersList: [],
        loading: false,
        errorText: ''
      }
    },

    methods: {
      getBrokers() {
        const base = process.env.VUE_APP_API_URL || 'http://localhost:3001';
        const isDevServer = typeof window !== 'undefined' && window.location && window.location.port === '8081';
        const url = isDevServer ? '/api/brokers' : (base + '/brokers');
        this.loading = true;
        this.errorText = '';
        fetch(url, { method: 'GET' })
          .then(resp => {
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return resp.json();
          })
          .then(value => { this.brokersList = value.Brokers || []; })
          .catch(err => {
            console.error('Login getBrokers error:', err);
            this.errorText = 'Нет соединения с сервером (API). Проверь, что backend запущен на ' + base + ' (или что работает dev proxy).';
          })
          .finally(() => { this.loading = false; });
      },

      checkBrokerInList() {
        let fullName = this.surname + ' ' + this.name;
        let idx = this.brokersList.findIndex(e => e.fullName === fullName);
        if (idx !== -1) {
          this.$store.commit('SET_NAME', fullName);
          this.$store.commit('SET_ROOT', this.adminRoot);
          this.$store.commit('SET_BALANCE', this.brokersList[idx].money);
          this.$store.commit('SET_STOCKS', this.brokersList[idx].stocks);
          this.$store.commit('SET_ID', this.brokersList[idx].id);
        }
        else {
          this.errorText = 'Пользователь не найден в списке брокеров';
        }
      }
    }
  }
</script>

<style scoped>
  .login{
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 420px;
    color: var(--text);
    border-radius: 6px;
    border: 1px solid var(--muted);
    border-left: 4px solid var(--accent);
    background: transparent;
    padding: 12px 14px 14px;
    margin: 16px auto 24px;
  }

  label{ font-size: 14px; opacity: .9; }
  input[type="text"]{
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--muted);
    border-radius: 6px;
    padding: 8px 10px;
  }

  .admin{ display: flex; align-items: center; gap: 8px; margin-top: 6px; }

  .button.primary{
    margin-top: 8px;
    width: 100%;
    border: none;
    border-radius: 6px;
    background: var(--success);
    color: #fff;
    padding: 10px 12px;
    cursor: pointer;
  }
  .button.primary:hover{ background: #059669; }
  .button.primary:disabled{ opacity:.6; cursor: not-allowed; }
  .error{ color: #fca5a5; font-size: 14px; margin-top: 6px; text-align: left; }
</style>