import API_CONFIG from '../config/api';

/**
 * Базовая функция для выполнения запросов к API
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции запроса
 * @returns {Promise<any>} - Результат запроса
 */
const fetchApi = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...API_CONFIG.REQUEST_OPTIONS,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Сервис для работы с API
 */
const ApiService = {
  /**
   * Получить список всех продуктов
   * @returns {Promise<Array>} - Список продуктов
   */
  getProducts: async () => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS)
        .then(data => data.products);
    }
    
    return fetchApi(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
  },

  /**
   * Получить детальную информацию о продукте по ID
   * @param {number|string} id - ID продукта
   * @returns {Promise<Object>} - Информация о продукте
   */
  getProductById: async (id) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов загружаем все продукты и находим нужный
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS)
        .then(data => {
          const product = data.products.find(p => p.id.toString() === id.toString());
          if (!product) {
            throw new Error('Продукт не найден');
          }
          return product;
        });
    }
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCT_DETAILS.replace(':id', id)}`;
    return fetchApi(url);
  },

  /**
   * Получить структуру каталога
   * @returns {Promise<Object>} - Структура каталога
   */
  getCatalog: async () => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      return fetchApi(API_CONFIG.LOCAL_JSON.CATALOG);
    }
    
    return fetchApi(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATALOG}`);
  },

  /**
   * Фильтрация продуктов по категории
   * @param {Object} category - Объект с параметрами категории
   * @returns {Promise<Array>} - Отфильтрованный список продуктов
   */
  filterProductsByCategory: async (category) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов загружаем все продукты и фильтруем на клиенте
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS)
        .then(data => {
          let filtered = data.products;
          
          if (category.department) {
            filtered = filtered.filter(p => p.department === category.department);
          }
          
          if (category.section) {
            filtered = filtered.filter(p => p.section === category.section);
          }
          
          if (category.subsection) {
            filtered = filtered.filter(p => p.subsection === category.subsection);
          }
          
          if (category.group) {
            filtered = filtered.filter(p => p.group === category.group);
          }
          
          return filtered;
        });
    }
    
    // Для реального API будем использовать query параметры
    const queryParams = new URLSearchParams();
    if (category.department) queryParams.append('department', category.department);
    if (category.section) queryParams.append('section', category.section);
    if (category.subsection) queryParams.append('subsection', category.subsection);
    if (category.group) queryParams.append('group', category.group);
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?${queryParams.toString()}`;
    return fetchApi(url);
  },

  /**
   * Поиск продуктов по запросу
   * @param {string} query - Поисковый запрос
   * @returns {Promise<Array>} - Результаты поиска
   */
  searchProducts: async (query) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов загружаем все продукты и фильтруем на клиенте
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS)
        .then(data => {
          if (!query) return data.products;
          
          const lowerQuery = query.toLowerCase();
          return data.products.filter(product => 
            product.title.toLowerCase().includes(lowerQuery)
          );
        });
    }
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?search=${encodeURIComponent(query)}`;
    return fetchApi(url);
  }
};

export default ApiService;
