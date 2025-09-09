Вот черновик `README.md` — на русском, с установкой, командами, CI/CD и ссылкой на деплой на GitHub Pages.

# Transit Costs Map

Интерактивная карта остановок: выбираете исходную остановку — остальные окрашиваются по «стоимости» поездки (минуты ожидания/в пути/пересадки из CSV).

* Демо: **[https://Ilya-Ogorodnikov.github.io/transit-cost-map/](https://Ilya-Ogorodnikov.github.io/transit-cost-map/)**
* Node.js: **20.15.0**
* Стек: React 18, Vite, TypeScript, Redux Toolkit, React-Redux, Leaflet + react-leaflet, PapaParse, Zod, Vitest, Testing Library, ESLint

## Что внутри

* `/data/sites.csv` — список остановок
* `/data/costs.csv` — стоимости для пар «из → в»
* Маркеры и подсказки: `react-leaflet/Leaflet`
* Парсинг CSV: `papaparse` + валидация `zod`
* Состояние: `@reduxjs/toolkit` (+ `react-redux`)
* Тесты: `vitest` + `@testing-library/*`
* Линт: `eslint` (flat config, React + TS)

---

## Быстрый старт

* Node.js **20.15.0**
* Yarn (поддерживается и Classic, и Berry)

### Установка

```bash
yarn install
```

### Запуск дев-сервера

```bash
yarn dev
```

Откройте: [http://localhost:5173](http://localhost:5173)

### Сборка и предпросмотр

```bash
# прод-сборка
yarn build

# локальный сервер для проверки прод-сборки
yarn preview
```

---

## Скрипты

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --open",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint --ext .ts,.tsx src",
    "lint:fix": "eslint --ext .ts,.tsx src --fix"
  }
}
```

---

## Тесты

* Среда: `jsdom`, глобальные матчеры из `@testing-library/jest-dom`
* Точки входа: `src/**/*.{test,spec}.{ts,tsx}`

Запуск:

```bash
yarn test          # одноразовый прогон
yarn test:watch    # режим разработчика
yarn test:coverage # с покрытием
```

---

## Линт

Flat-конфиг (`eslint.config.js`) с плагинами React/React-Hooks/TypeScript.

```bash
yarn lint
yarn lint:fix
```

---

## Деплой на GitHub Pages

Проект деплоится автоматически при пуше в `main`.
Workflow: `.github/workflows/pages.yml`.

---

## CI

Workflow `CI (lint + tests)` — `.github/workflows/ci.yml`:

* триггеры: push/PR в `main`
* job `Lint` → job `Test` (Vitest)
* Yarn + кеш по `yarn.lock`

