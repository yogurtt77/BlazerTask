// Конфигурация API
const API_CONFIG = {
  // Базовый URL API
  BASE_URL: "http://test.api.sadi.kz",

  // Флаг, указывающий, используем ли мы локальные JSON-файлы или реальный API
  USE_LOCAL_JSON: false,

  // Пути к локальным JSON-файлам (для резервного использования)
  LOCAL_JSON: {
    PRODUCTS: "/products2.json",
    CATALOG: "/data2.json",
  },

  // Пути к API endpoints
  ENDPOINTS: {
    PRODUCTS: "/api/Materials",
    PRODUCT_DETAILS: "/api/Materials/:id",
    CATALOG: "/api/MaterialTrees",
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
