<template>
  <div class="header-info">
    <div class="header-logo">
      <button class="invisible-button"  @click="returnToStartPage">
          <p>Торговая Биржа</p>
      </button>
    </div>
    <div class="header-small-elem">
      <p v-if="getAdminRoot()">{{getFullName}} [администратор] </p>
      <p v-else>{{getFullName}} [пользователь] </p>
      <p class="balance">Баланс: {{getBalance}}$</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  mounted () {},
  data() {
    return {};
  },
  methods: {
    getAdminRoot () {return this.$store.getters.getAdminRoot;},
    returnToStartPage () {window.location.href = '/';}
  },
  computed: {
    getFullName () {return this.$store.getters.getFullName;},
    getBalance () {return this.$store.getters.getBalance;},
  }
}
</script>

<style scoped>
  .header-info{
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 960px;
    margin: 0 auto 16px;
    color: var(--text);
    font-size: 18px;
  }

  p { color: var(--text); font-family: Arial, Helvetica, sans-serif; margin: 0; }

  .header-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    color: var(--text);
    border-radius: 6px;
    border: 1px solid var(--muted);
    border-left: 4px solid var(--accent);
    background: transparent;
  }

  .header-small-elem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    color: var(--text);
    border-radius: 6px;
    background: var(--panel);
    border: 1px solid var(--muted);
  }

  a { color: var(--text); font-size: 18px; font-family: Arial, Helvetica, sans-serif; }

  .header-user-elem { display: block; padding: 10px; color: var(--text); border-radius: 6px; background: var(--panel); }

  .header-line { display:none; }

  .invisible-button { background: none; color: inherit; border: none; padding: 0; font: inherit; cursor: pointer; outline: inherit; }

  .balance { opacity: 0.85; }

  @media (max-width: 640px){
    .header-info{ font-size: 16px; }
    .header-small-elem{ flex-direction: column; align-items: flex-start; gap: 6px; }
  }
</style>