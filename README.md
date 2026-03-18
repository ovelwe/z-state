# @ovelwe/z-state

Лёгкий и понятный state manager для React с middleware, computed values и поддержкой Redux DevTools.

## Возможности

- Простой внешний store
- Подписки на изменения состояния
- React hooks через `useSyncExternalStore`
- Селекторы с кастомной функцией сравнения
- API в стиле `create(...)` как у Zustand
- Middleware
- Persist в `localStorage` или другом `storage`
- Computed values
- Подключение к Redux DevTools
- TypeScript support

---

## Установка

```bash
npm install @ovelwe/z-state
```

# Импорт
```ts
import {
  createStore,
  useStore,
  useStoreSelector,
  create,
  loggerMiddleware,
  createPersistStore,
  connectDevTools,
  computed,
} from '@ovelwe/z-state';
```

# Быстрый старт
## Создание хранилища
```ts
import { createStore } from '@ovelwe/z-state';

const store = createStore({
  count: 0,
  text: 'hello',
});
```
## Получение состояния
```ts
console.log(store.getState());
// { count: 0, text: 'hello' }
```
## Изменение состояния
Можно передавать объект:
```ts 
store.setState({ count: 1 });
```
Или функцию:
```ts
store.setState((prev) => ({
  count: prev.count + 1,
}));
```
## Подписка на изменения
```ts 
const unsubscribe = store.subscribe(() => {
  console.log('state changed:', store.getState());
});

store.setState({ count: 2 });

unsubscribe();
```
# Использование в React 19
## useStore
`useStore(store)` подписывает компонент на весь store
```tsx
import { createStore, useStore } from '@ovelwe/z-state';

const counterStore = createStore({
    count: 0,
});

export function App() {
    const state = useStore(counterStore);

    return (
        <div>
            <h2>{state.count}</h2>
            <button
                onClick={() =>
                    counterStore.setState((prev) => ({ count: prev.count + 1 }))
                }
            >
                Добавить
            </button>
        </div>
    );
}
```
## useStoreSelector
Если нужен только кусок состояния, используй селектор
```tsx
import { createStore, useStoreSelector } from '@ovelwe/z-state';

const userStore = createStore({
    name: 'Danil',
    age: 20,
    city: 'Moscow',
});

export function App() {
    const name = useStoreSelector(userStore, (state) => state.name);

    return <div>{name}</div>;
}
```
Кастомная функция сравнения:
```ts
import { createStore, useStoreSelector } from '@ovelwe/z-state';

const store = createStore({
    user: {
        name: 'Danil',
        age: 20,
    },
});

export function App() {
    const user = useStoreSelector(
        store,
        (state) => state.user,
        (a, b) => a.name === b.name && a.age === b.age
    );

    return (
        <div>
            {user.name} - {user.age}
        </div>
    );
}
```
# API как в Zustand
## Если хочется API, похожий на Zustand, можно использовать create.
### Пример
```tsx
import { create } from '@ovelwe/z-state';

type CounterStore = {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
    count: 0,
    increment: () => set((prev) => ({ count: prev.count + 1 })),
    decrement: () => set((prev) => ({ count: prev.count - 1 })),
    reset: () => set({ count: 0 }),
}));

export function App() {
    const count = useCounterStore((state) => state.count);
    const increment = useCounterStore((state) => state.increment);
    const decrement = useCounterStore((state) => state.decrement);
    const reset = useCounterStore((state) => state.reset);

    return (
        <div>
            <button onClick={decrement}>-</button>
            <span style={{ margin: '0 12px' }}>{count}</span>
            <button onClick={increment}>+</button>
            <button onClick={reset} style={{ marginLeft: 12 }}>
                Reset
            </button>
        </div>
    );
}
```
## Использование store API вне компонента
Store, созданный через `create`, дополнительно имеет методы:

- `getState`
- `setState`
- `subscribe`
- `destroy`
  
```ts
useCounterStore.getState();

useCounterStore.setState({ count: 10 });

const unsubscribe = useCounterStore.subscribe(() => {
  console.log(useCounterStore.getState());
});

unsubscribe();
```

# Middleware
`z-state` поддерживает middleware через `options.middleware`
## Встроенный loggerMiddleware
```ts
import { createStore, loggerMiddleware } from '@ovelwe/z-state';

const store = createStore(
  { count: 0 },
  {
    middleware: [loggerMiddleware()],
  }
);

store.setState({ count: 1 });
```

В консоли будет: 
* Предыдущее состояние
* action
* следующее состояние

## Кастомный middleware
```ts
import { createStore, loggerMiddleware } from '@ovelwe/z-state';

const store = createStore(
  { count: 0 },
  {
    middleware: [loggerMiddleware()],
  }
);

store.setState({ count: 1 });
```

# Persist
Для хранения состояния между перезагрузками страницы можно использовать `createPersistStore`
### Пример
```ts
import { createPersistStore } from '@ovelwe/z-state';

const settingsStore = createPersistStore(
  {
    theme: 'light',
    language: 'ru',
  },
  {
    key: 'app-settings',
  }
);
```
Теперь состояние автоматически:

* восстанавливается при создании store
* сохраняется после обновлений

## Кастомная сериализация
```ts
import { createPersistStore } from '@ovelwe/z-state';

const store = createPersistStore(
  { value: 123 },
  {
    key: 'custom-store',
    serialize: (state) => JSON.stringify(state),
    deserialize: (value) => JSON.parse(value),
  }
);
```

# Computed values
`computed` создаёт вычисляемую функцию на основе состояния store

### Пример
```ts
import { createStore, computed } from '@ovelwe/z-state';

const userStore = createStore({
  firstName: 'Danil',
  lastName: 'Zobkov',
});

const fullName = computed(userStore, (state) => {
  return `${state.firstName} ${state.lastName}`;
});

console.log(fullName()); // Danil Zobkov
```

### Пример 2
```ts
import { createStore, computed } from '@ovelwe/z-state';

const cartStore = createStore({
  items: [
    { id: 1, price: 100, qty: 2 },
    { id: 2, price: 50, qty: 3 },
  ],
});

const totalPrice = computed(cartStore, (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
);

console.log(totalPrice()); // 350
```

# Redux Devtools
Можно подключить store к Redux DevTools Extension
### Пример
```ts
import { createStore, connectDevTools } from '@ovelwe/z-state';

const store = createStore({
  count: 0,
});

const disconnect = connectDevTools(store, 'Counter Store');
```

После этого изменения состояния будут видны в Redux DevTools.

**Чтобы отключить:**
```ts
disconnect();
```
>Для работы нужен установленный Redux DevTools в браузере

# onUpdate
Можно отслеживать изменения состояния через `onUpdate`
```ts
import { createStore } from '@ovelwe/z-state';

const store = createStore(
  { count: 0 },
  {
    onUpdate: (newState, prevState) => {
      console.log('prev state:', prevState);
      console.log('new state:', newState);
    },
  }
);
```
# destroy
Метод `destroy()`:

 - очищает всех подписчиков
 - сбрасывает состояние к начальному

```ts
store.destroy();
```
