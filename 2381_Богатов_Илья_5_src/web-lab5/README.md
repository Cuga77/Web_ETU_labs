# Web Lab 5

Полноценное SPA + backend на NestJS. Фронтенд (Create React App) подключается к backend по Socket.IO.

## Стек
- Backend: NestJS 10, Socket.IO, RxJS
- Frontend: React 18 (CRA), Redux Toolkit, react-router-dom, socket.io-client, Chart.js
- Node.js: 18+

## Структура проекта
- my-nest/ — сервер NestJS (порт 3001)
- my-react/ — клиент React (порт 3000)

## Требования
- Node.js 18+ и npm
- Свободные порты 3000 (frontend) и 3001 (backend)

## Команды для Linux (копируй-вставляй)

Проверка и установка Node.js 18+:

```bash
node -v
```

Если версии нет или ниже 18 — установить через nvm:

```bash
# Установка nvm (если нет)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Установка и использование Node 18
nvm install 18
nvm use 18
```

Установка зависимостей:

```bash
# Backend
cd my-nest
npm install
cd ..

# Frontend
cd my-react
npm install
cd ..
```

Запуск (в двух терминалах):

- Терминал 1 — backend (порт 3001):

```bash
cd my-nest
npm run start:dev
```

- Терминал 2 — frontend (порт 3000):

```bash
cd my-react
npm start
```

Открыть фронтенд в браузере:

```bash
xdg-open http://localhost:3000 || sensible-browser http://localhost:3000 || echo "Открой вручную: http://localhost:3000"
```

Если порт занят — освободить:

```bash
# Backend 3001
lsof -ti:3001 | xargs -r kill -9

# Frontend 3000
lsof -ti:3000 | xargs -r kill -9
```

Альтернативный порт для frontend (если 3000 занят):

```bash
cd my-react
PORT=3002 npm start
```

## Быстрый старт
1. Установка зависимостей
   - Backend:
     - Перейти в папку `my-nest`
     - `npm install`
   - Frontend:
     - Перейти в папку `my-react`
     - `npm install`

2. Запуск приложений (в двух терминалах)
   - Backend (порт 3001):
     - В папке `my-nest`: `npm run start:dev`
   - Frontend (порт 3000):
     - В папке `my-react`: `npm start`

3. Открыть в браузере
   - http://localhost:3000

## Подключение Socket.IO
- Клиент подключается к `http://localhost:3001`
- CORS в backend разрешает `http://localhost:3000`
- Файл подключения на фронте: `my-react/src/app.socket.js`
- Порт backend задаётся в `my-nest/src/main.ts` (по умолчанию 3001)

## Скрипты npm
- Backend (`my-nest/package.json`):
  - `npm run start` — запуск
  - `npm run start:dev` — запуск с перезапуском при изменениях
  - `npm run build` — сборка
  - `npm run test` — тесты
- Frontend (`my-react/package.json`):
  - `npm start` — dev-сервер CRA
  - `npm run build` — сборка
  - `npm test` — тесты

## Частые проблемы
- Порт занят:
  - Backend: измените порт в `my-nest/src/main.ts` (метод `app.listen(<port>)`)
  - Frontend: можно запустить с другим портом: `PORT=3002 npm start`
- Ошибка CORS/Network:
  - Убедитесь, что backend запущен на `http://localhost:3001`
  - Проверьте, что фронт запущен на `http://localhost:3000`

## Разработка
- Backend код в `my-nest/src` (контроллеры, модули, socket.service.ts)
- Frontend код в `my-react/src` (страницы, Redux store, компоненты)

## Лицензия
UNLICENSED
