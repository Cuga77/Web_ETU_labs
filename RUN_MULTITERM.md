# Команды запуска по лабораторным (в разных терминалах)

Лабораторная 3 — Backend (Express + NeDB)
```
cd /home/cuga/web/2381_Богатов_Илья_3_src/social-network
npm install
npm run webpack  # или npm run gulp
npm start        # https://localhost:8443
```

---

Лабораторная 4 — Frontend (Angular)
```
cd /home/cuga/web/2381_Богатов_Илья_4_src/social-network
npm install
ng serve --ssl --port 4443   # или: npm run start -- --ssl --port 4443
# Открыть: https://localhost:4443
```

---

Лабораторная 5 — Admin (NestJS + React)
Терминал A — Nest backend
```
cd /home/cuga/web/2381_Богатов_Илья_5_src/web-lab5/my-nest
npm install
npm run start:dev            # http://localhost:3001
```
Терминал B — React admin
```
cd /home/cuga/web/2381_Богатов_Илья_5_src/web-lab5/my-react
npm install
npm start                    # http://localhost:3000
```

---

Лабораторная 6 — Trading app (Vue)
```
cd /home/cuga/web/2381_Богатов_Илья_6_src/lb6/vue-app
npm install
npm run serve                # http://localhost:8081 (proxy на http://localhost:3001)
```

---

E2E тест (ЛР6)
(Требуется: L5 Nest http://localhost:3001 и L6 Vue http://localhost:8081)
```
cd /home/cuga/web/2381_Богатов_Илья_6_src/lb6
npm install
npm run test:e2e
```
