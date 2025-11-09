# Social Network (Frontend + Backend)

Единая инструкция для запуска и разработки двух частей проекта: бэкенда (Express + NeDB) и фронтенда (Angular), с учётом HTTPS, прокси и тестовых данных.

## Пути проектов

- Backend: `/home/cuga/web/2381_Богатов_Илья_3_src/social-network`
- Frontend: `/home/cuga/web/2381_Богатов_Илья_4_src/social-network`

## Требования

- Node.js 18+
- npm 9+

## Установка зависимостей

- Backend:
  ```bash
  cd /home/cuga/web/2381_Богатов_Илья_3_src/social-network
  npm install
  ```
- Frontend:
  ```bash
  cd /home/cuga/web/2381_Богатов_Илья_4_src/social-network
  npm install
  ```

## HTTPS и прокси

- Бэкенд слушает: `https://localhost:8443`
- Фронтенд запускается: `https://localhost:4443`
- Прокси фронта (`proxy.conf.json`) перенаправляет `/api` и `/uploads` на `https://localhost:8443`
- При первом заходе по HTTPS браузер может запросить доверие к локальному сертификату — подтвердите.

## Запуск

### Вариант A — два терминала
- Backend:
  ```bash
  cd /home/cuga/web/2381_Богатов_Илья_3_src/social-network
  npm start
  ```
- Frontend:
  ```bash
  cd /home/cuga/web/2381_Богатов_Илья_4_src/social-network
  ng serve --ssl --port 4443
  # или
  npm run start -- --ssl --port 4443
  ```
- Открыть фронт: `https://localhost:4443`
- Админка/бэк: `https://localhost:8443`

### Вариант B — одной командой
```bash
npx concurrently -k -s first -n backend,frontend -c "cyan,magenta" \
 "npm --prefix /home/cuga/web/2381_Богатов_Илья_3_src/social-network start" \
 "npm --prefix /home/cuga/web/2381_Богатов_Илья_4_src/social-network run start -- --ssl --port 4443"
```

## Тестовые данные (сидирование)

- Папка БД бэкенда: `/home/cuga/web/2381_Богатов_Илья_3_src/social-network/db/`
  - `users.json` — пользователи (поля: `following`, `followers`, `posts`, `chats`)
  - `posts.json` — посты
  - `chats.json` — чаты и сообщения
- Подготовлено:
  - У пользователя `8L1yt7vC7r3qaZIm` есть `following=["bhHYENORMujV1l9y"]` — лента не пустая
  - Создан чат `Zchat1` между `8L1yt7vC7r3qaZIm` и `bhHYENORMujV1l9y` с двумя сообщениями
  - У обоих пользователей добавлена ссылка на чат

## Тема (Dark)

- Тёмная тема Angular Material: `@angular/material/prebuilt-themes/pink-bluegrey.css`
- Доп. тёмные стили: `2381_Богатов_Илья_4_src/social-network/src/styles.css`

## Сборка фронтенда
```bash
cd /home/cuga/web/2381_Богатов_Илья_4_src/social-network
npm run build
```
Результат: `dist/social-network-client/`.


## Полезное

- Генерация компонента (фронт):
  ```bash
  ng generate component component-name
  ```
- Документация Angular CLI: https://angular.dev/tools/cli
