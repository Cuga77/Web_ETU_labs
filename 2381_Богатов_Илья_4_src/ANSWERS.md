# ЛР4 — Ответы на проверочные вопросы

1) Где исполняется Angular? Установка/создание/запуск
- Angular — SPA-фреймворк, исполняется в браузере; сборка выполняется инструментами CLI.
- Установка CLI: `npm i -g @angular/cli`
- Создание: `ng new app`
- Запуск: `cd app && ng serve --ssl --port 4443`

2) Что такое компонент? Пример
- Единица UI (шаблон + класс + стили + метаданные).
```ts
@Component({selector:'app-hello',template:`<h1>{{title}}</h1>`})
export class HelloComponent{ title='Hi'; }
```
- Подключение: добавить в маршруты/шаблон: `<app-hello/>`

3) Компоненты vs сервисы
- Компоненты отображают UI и реагируют на события.
- Сервисы инкапсулируют логику/данные, внедряются через DI (`providedIn:'root'`).

4) Шаблоны и директивы условия/цикла
```html
<div *ngIf="isAuth; else guest">Hi</div>
<ng-template #guest>Guest</ng-template>
<li *ngFor="let p of posts; index as i">{{i}} {{p.title}}</li>
```

5) Директивы: назначение и пример
- Расширяют разметку (структурные: `*ngIf`, атрибутные: `[class.active]`).
```ts
@Directive({selector:'[appFocus]'} )
export class FocusDirective{ constructor(el:ElementRef){ el.nativeElement.focus(); } }
```

6) Обещания (Promise) и обработка ошибок
```ts
api.get().then(r=>...).catch(err=>console.error(err));
try{ await api.get(); }catch(e){ console.error(e); }
```

7) Журнал ошибок
- Можно использовать стандартный `ErrorHandler`, `HttpInterceptor`, внешние сервисы (Sentry/Rollbar). Пример перехвата:
```ts
@Injectable()
export class GlobalErrors implements ErrorHandler{ handleError(e:any){ console.error(e); } }
```

8) WebSocket: пример сервер/клиент
- Сервер (Node + socket.io):
```js
io.on('connection',s=>{ s.emit('msg',{text:'hi'}); });
```
- Клиент (Angular сервис):
```ts
import {io} from 'socket.io-client';
const socket=io('https://localhost:8443');
socket.on('msg',m=>console.log(m));
```

9) Пример Jest-теста
```ts
test('sum', ()=>{ const sum=(a,b)=>a+b; expect(sum(2,3)).toBe(5); });
```
