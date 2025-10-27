<template>
  <div class="navigator">
    <router-link to="/admin" class="router" active-class="active">Админ панель</router-link>
    <router-link to="/exchange" class="router" active-class="active">Торги</router-link>
    <router-link to="/login" class="router" active-class="active">Войти</router-link>
  </div>
  <AppHeader/>
  <router-view/>
</template>

<script>
import AppHeader from './components/Header.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
  :root{
    --bg:#0b1220; --panel:#111827; --muted:#374151; --text:#e5e7eb; --accent:#2563eb;
    --success:#10b981; --danger:#ef4444;
  }

  html, body, #app{
    height: 100%;
  }

  body{
    margin: 0;
    background: var(--bg);
  }

  #app {
    font-family: Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--text);
    padding-top: 24px;
  }

  .navigator{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 auto 16px;
    padding: 10px 12px;
    max-width: 960px;
    border: 1px solid var(--muted);
    border-left: 4px solid var(--accent);
    border-radius: 6px;
    background: transparent;
  }

  .router{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    color: var(--text);
    border-radius: 6px;
    background: #374151;
    text-decoration: none;
    transition: background .15s ease, box-shadow .15s ease;
  }

  .router:hover{ background:#4b5563; }
  .router.active{ background:#1f2937; box-shadow: inset 0 0 0 2px var(--accent); }
</style>
