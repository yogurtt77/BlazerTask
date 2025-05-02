# Прайс-листы

Веб-приложение для просмотра и управления прайс-листами поставщиков.

## Особенности

- Просмотр прайс-листов поставщиков
- Фильтрация по категориям и регионам
- Адаптивный дизайн для мобильных устройств
- Корзина для сохранения выбранных товаров

## Технологии

- React
- Styled Components
- JavaScript

## Установка и запуск

### Требования

- Node.js 14.x или выше
- npm 6.x или выше

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

### Сборка для production

```bash
npm run build
```

## Деплой

### Деплой на Netlify

1. Создайте аккаунт на [Netlify](https://www.netlify.com/)
2. Выполните сборку проекта:
   ```bash
   npm run build
   ```
3. Перетащите папку `build` в интерфейс Netlify или используйте Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Деплой на Vercel

1. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Войдите в аккаунт:
   ```bash
   vercel login
   ```
3. Выполните деплой:
   ```bash
   vercel --prod
   ```

### Деплой на GitHub Pages

1. Установите gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Добавьте в package.json:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Выполните деплой:
   ```bash
   npm run deploy
   ```

## Переменные окружения

Проект использует следующие переменные окружения:

- `REACT_APP_API_URL` - URL API сервера
- `REACT_APP_VERSION` - Версия приложения
- `REACT_APP_ENV` - Окружение (development, production)

## Структура проекта

```
src/
  ├── components/       # React компоненты
  ├── data/            # Данные и моки
  ├── styles/          # Глобальные стили
  ├── App.js           # Главный компонент приложения
  └── index.js         # Точка входа
```
