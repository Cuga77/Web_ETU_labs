# ЛР3 — Ответы на проверочные вопросы

1) Что такое и для чего предназначены LESS, SASS/SCSS? Примеры переменных, миксинов, операторов
- LESS/SASS — препроцессоры CSS: переменные, вложенность, миксины, функции, операторы.
- Переменные: `$primary: #0d6efd;` (SASS) / `@primary: #0d6efd;` (LESS)
- Миксин:
  - SASS:
    ```scss
    @mixin btn($bg){ background:$bg; color:#fff; padding:.5rem 1rem; }
    .btn-primary{ @include btn($primary); }
    ```
  - LESS:
    ```less
    .btn(@bg){ background:@bg; color:#fff; padding:.5rem 1rem; }
    .btn-primary{ .btn(@primary); }
    ```
- Операторы: `width: calc(100% - 16px);` или в препроцессоре `width: (100% - 16px);`

2) Примеры использования jQuery для изменения DOM. Отличия от «чистого» JS
- jQuery: `$('#usersTable tr').addClass('active'); $('#id').text('Hello');`
- Vanilla: `document.querySelectorAll('#usersTable tr').forEach(el=>el.classList.add('active')); document.getElementById('id').textContent='Hello'`
- Отличие: jQuery даёт компактные селекторы, кроссбраузерные API и цепочки вызовов.

3) Примеры jQuery AJAX. Отличия от XHR/fetch
- jQuery:
```js
$.ajax({ url:'/api/user', method:'POST', data: formData, processData:false, contentType:false });
```
- fetch:
```js
fetch('/api/user',{method:'POST',body:formData});
```
- Отличия: jQuery инкапсулирует XHR и сериализацию, имеет хелперы (`$.get`, `$.post`).

4) Для чего babel? Модули и команды
- Транспилер JS (ES6+ → совместимый JS). Плагины/пресеты: `@babel/core`, `@babel/preset-env`, загрузчик `babel-loader`.
- Пример: webpack с `babel-loader` или gulp-babel; CLI: `npx babel src --out-dir dist`.

5) Для чего Gulp? Примеры (less, sass, babel, pug, ejs, минификация)
- Оркестратор задач. Примеры задач: компиляция SASS (`gulp-sass`), минификация CSS (`gulp-clean-css`), JS (`gulp-uglify`), транспиляция (`gulp-babel`), шаблоны Pug/EJS.

6) Регистрация npm модуля, использование, обновление версии
- Публикация: `npm login` → `npm publish` (package.json с уникальным name)
- Использование: `npm install <name>` → `import ... from '<name>'`
- Обновление версии: `npm version patch|minor|major` → `npm publish`

7) Для чего Webpack? Простейшая конфигурация
- Бандлер модулей: сборка JS/CSS/изображений, код-сплиттинг, минификация.
```js
// webpack.config.js
module.exports={ entry:'./src/index.js', output:{filename:'bundle.js',path:__dirname+'/dist'}, module:{ rules:[{test:/\.m?js$/, use:'babel-loader'}]}};
```
