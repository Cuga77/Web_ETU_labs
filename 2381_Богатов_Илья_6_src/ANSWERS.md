# ЛР6 — Ответы на проверочные вопросы

1) Из чего состоит компонент Vue?
- SFC (Single File Component): `<template>` + `<script>` + `<style>`; реактивные `data`, `props`, `computed`, `methods`, хуки жизненного цикла.

2) Привязка параметров/свойств/событий
```html
<img :src="url" :alt="title"/>
<button @click="save" :disabled="loading">Save</button>
<div :class="{active:isActive}"></div>
```

3) Передача между родителем и дочерним
- Вниз: `props`; вверх: пользовательские события `this.$emit('update',payload)` и слушатели `@update="onUpdate"`.

4) Маршрутизация и параметры
```js
const routes=[{path:'/user/:id',component:User}];
// внутри компонента: const route=useRoute(); route.params.id
```

5) Основные понятия Vuex. Единое состояние
- `state`, `getters`, `mutations` (синхронно), `actions` (асинхронно), `modules` — одно централизованное хранилище.

6) Как изменить состояние Vuex (синхронно/асинхронно)
```js
store.commit('SET_BALANCE', 100);            // sync (mutation)
await store.dispatch('loadUser');            // async (action → commit)
```

7) Автотест клиентской части
- Headless-браузер (Selenium/WebDriver/Puppeteer/Playwright): открыть страницу, выполнить действия (ввод, клик), проверить DOM/текст, скриншоты. В проекте добавлен пример Selenium‑теста для покупки акций.
