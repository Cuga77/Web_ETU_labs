# Labs 3–6: How to run

This guide explains how to start all parts of the project locally.

## Prerequisites
- Node.js 18+
- npm 9+
- Modern browser (accept local HTTPS certs on first run)

---

## Lab 3 — Admin module (Express + NeDB)
Backend path: /home/cuga/web/2381_Богатов_Илья_3_src/social-network

1) Install deps
```
cd /home/cuga/web/2381_Богатов_Илья_3_src/social-network
npm install
```
2) Configure .env (already present). Ensure:
```
PORT=8443
API_URL=https://localhost:8443/api
KEY_FILE=social_network.key
CERT_FILE=social_network.csr
DB_DIRNAME=db
BUILD=webpack
DEBUG=social-network:*
NODE_TLS_REJECT_UNAUTHORIZED=0
```
3) Build static (choose one)
```
# webpack build
npm run webpack
# or gulp build
npm run gulp
```
4) Run
```
npm start
```
Open admin: https://localhost:8443/users/all

Notes
- HTTPS: accept local certificate in the browser when prompted
- jQuery and jQuery UI are used on admin pages (users list, forms)

---

## Lab 4 — User module (Angular)
Frontend path: /home/cuga/web/2381_Богатов_Илья_4_src/social-network

1) Install deps
```
cd /home/cuga/web/2381_Богатов_Илья_4_src/social-network
npm install
```
2) Start dev server (HTTPS + proxy)
```
ng serve --ssl --port 4443
# or
npm run start -- --ssl --port 4443
```
3) Open
- Frontend: https://localhost:4443
- Backend API from Lab 3 must be running at https://localhost:8443

Notes
- Socket.IO was removed to comply with REST-only requirement. Chats use REST
- If you see 403 on /api, ensure frontend is served via HTTPS and backend runs on 8443

---

## Lab 5 — Stock Exchange Admin (NestJS + React + Redux + Chart.js)
Paths:
- Backend (Nest): /home/cuga/web/2381_Богатов_Илья_5_src/web-lab5/my-nest
- Frontend (React): /home/cuga/web/2381_Богатов_Илья_5_src/web-lab5/my-react

Backend (Nest)
```
cd /home/cuga/web/2381_Богатов_Илья_5_src/web-lab5/my-nest
npm install
npm run start:dev
# server: http://localhost:3001
```
Frontend (React)
```
cd /home/cuga/web/2381_Богатов_Илья_5_src/web-lab5/my-react
npm install
npm start
# client: http://localhost:3000
```
Data
- JSON files at my-nest/data (brokers-list.json, stocks-list.json, companies/*.json)

---

## Lab 6 — Trading app (Vue + WebSocket + REST)
Path: /home/cuga/web/2381_Богатов_Илья_6_src/lb6/vue-app

Backend dependency: Lab 5 Nest backend must be running on http://localhost:3001

1) Install deps
```
cd /home/cuga/web/2381_Богатов_Илья_6_src/lb6/vue-app
npm install
```
2) Dev server with API proxy to Nest
```
npm run serve
# Vue dev: http://localhost:8081
# Proxy: /api -> http://localhost:3001
```
3) Start trading (from React Admin in Lab 5 or via REST call):
- POST http://localhost:3001/startSale
  Body example:
```
{
  "stocks": ["AAPL", "MSFT"],
  "startDate": "2021-10-06",
  "changeSpeed": 1
}
```
4) Open Vue app (http://localhost:8081), login using a name from brokers-list.json, and trade.

---

## E2E test (Lab 6)
Path: /home/cuga/web/2381_Богатов_Илья_6_src/lb6/e2e/buy-sell.test.js

Run prerequisites
- Nest (Lab 5) at http://localhost:3001
- Vue (Lab 6) at http://localhost:8081

Run test
```
cd /home/cuga/web/2381_Богатов_Илья_6_src/lb6
npm install
npm run test:e2e
```
The test:
- Starts sale via REST
- Opens Vue app
- Logs in using a broker from brokers-list.json
- Performs buy and sell actions and validates balance/stocks updates

---

## Tips
- For responsive checks, resize the browser window; lists and panels should adapt.
- If sockets don’t stream, verify Nest console logs and CORS.

---

## Control questions answers (per lab)
- Lab 3 answers: 2381_Богатов_Илья_3_src/ANSWERS.md
- Lab 4 answers: 2381_Богатов_Илья_4_src/ANSWERS.md
- Lab 5 answers: 2381_Богатов_Илья_5_src/ANSWERS.md
- Lab 6 answers: 2381_Богатов_Илья_6_src/ANSWERS.md
