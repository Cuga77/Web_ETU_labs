# ЛР5 — Ответы на проверочные вопросы

1) Что такое JSX? Примеры
- Расширение синтаксиса JS для декларативной разметки компонентов: `{expr}` внутри тегов.
```jsx
const Hello=({name})=> <h1>Hello, {name}</h1>;
```

2) Способы создания компонентов
- Функциональные компоненты: `function Comp(){ return <div/> }`
- Компоненты-стрелки: `const Comp=()=> <div/>`
- Классовые (устаревшие для новых проектов): `class Comp extends React.Component{ render(){...} }`

3) Обработка событий и передача информации
```jsx
function Btn({onClick}){ return <button onClick={onClick}>Ok</button>; }
function Parent(){ const [n,setN]=useState(0); return <Btn onClick={()=>setN(n+1)}/> }
```
- Данные вниз — через props; вверх — через колбэки/контекст.

4) Состояние React-приложения
- Локальное состояние `useState`, `useReducer`; глобальное — Context/Redux/Zustand и т. п.

5) Маршрутизация в React
- `react-router-dom`: 
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/stocks" element={<Stocks/>}/>
  </Routes>
</BrowserRouter>
```

6) Что такое Redux? Возможности
- Единое хранилище состояния, неизменяемость, предсказуемые редьюсеры, middleware, devtools.
```js
const store=configureStore({reducer:{ counter: counterSlice.reducer }});
store.dispatch(counterSlice.actions.inc());
```
