// Конфигурация API
const API_CONFIG = {
  // Базовый URL API
  // Для разработки используем локальные JSON-файлы
  // При переходе на реальный API, замените на URL вашего API
  BASE_URL: process.env.REACT_APP_API_URL || "",

  // Флаг, указывающий, используем ли мы локальные JSON-файлы или реальный API
  USE_LOCAL_JSON: process.env.REACT_APP_USE_LOCAL_JSON === "true" || true,

  // Пути к локальным JSON-файлам
  LOCAL_JSON: {
    PRODUCTS: "/products2.json",
    CATALOG: "/data2.json",
  },

  // Пути к API endpoints
  ENDPOINTS: {
    PRODUCTS: "/api/products",
    PRODUCT_DETAILS: "/api/products/:id",
    CATALOG: "/api/catalog",
  },

  // Настройки запросов
  REQUEST_OPTIONS: {
    headers: {
      "Content-Type": "application/json",
      // Здесь можно добавить заголовки авторизации, когда API будет готов
      // 'Authorization': `Bearer ${token}`,
    },
  },
};

export default API_CONFIG;
