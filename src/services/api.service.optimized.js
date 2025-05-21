import API_CONFIG from "../config/api";

// Кэш для хранения данных
const cache = {
  catalog: null,
  products: null,
  department21: null,
  department21Products: null,
  categoryProducts: {},
};

/**
 * Базовая функция для выполнения запросов к API с кэшированием
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции запроса
 * @param {string} cacheKey - Ключ для кэширования результата
 * @returns {Promise<any>} - Результат запроса
 */
const fetchApi = async (url, options = {}, cacheKey = null) => {
  // Если указан ключ кэша и данные уже есть в кэше, возвращаем их
  if (cacheKey && cache[cacheKey]) {
    console.log(`Данные получены из кэша: ${cacheKey}`);
    return cache[cacheKey];
  }

  try {
    console.log(`Запрос к API: ${url}`);
    const response = await fetch(url, {
      ...API_CONFIG.REQUEST_OPTIONS,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Если указан ключ кэша, сохраняем данные в кэш
    if (cacheKey) {
      cache[cacheKey] = data;
      console.log(`Данные сохранены в кэш: ${cacheKey}`);
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
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
      // Для новой структуры данных products2.json - это массив объектов
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS);
    }

    // Если у нас уже есть кэшированные продукты отдела 21, возвращаем их
    if (cache.department21Products) {
      return cache.department21Products;
    }

    // По умолчанию фильтруем по отделу 21 (МАТЕРИАЛЫ И КОНСТРУКЦИИ ДЛЯ ОБЩЕСТРОИТЕЛЬНЫХ РАБОТ)
    try {
      // Получаем данные каталога
      const catalogData = await ApiService.getCatalog();

      // Находим отдел 21
      const department21 = catalogData.find((item) => item.Code === "21");

      if (!department21) {
        console.error("Отдел 21 не найден в каталоге");
        // Если отдел 21 не найден, возвращаем все продукты
        const products = await fetchApi(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
          {},
          "products"
        );
        return products;
      }

      // Сохраняем отдел 21 в кэш
      cache.department21 = department21;

      // Создаем ключ для кэша категории
      const categoryKey = `department_${department21.MaterialTreeId}`;

      // Проверяем, есть ли уже отфильтрованные продукты в кэше
      if (cache.categoryProducts[categoryKey]) {
        return cache.categoryProducts[categoryKey];
      }

      // Получаем все продукты
      const products = await fetchApi(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
        {},
        "products"
      );

      // Фильтруем продукты по отделу 21 и его подкатегориям
      const filteredProducts = ApiService._filterProductsByCategory(
        products,
        catalogData,
        { department: department21.MaterialTreeId.toString() }
      );

      // Сохраняем отфильтрованные продукты в кэш
      cache.department21Products = filteredProducts;
      cache.categoryProducts[categoryKey] = filteredProducts;

      return filteredProducts;
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
      throw error;
    }
  },

  /**
   * Получить детальную информацию о продукте по ID
   * @param {number|string} id - ID продукта
   * @returns {Promise<Object>} - Информация о продукте
   */
  getProductById: async (id) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов загружаем все продукты и находим нужный
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS).then((data) => {
        // В новой структуре products2.json - это массив объектов
        const product = data.find(
          (p) => p.MaterialId.toString() === id.toString()
        );
        if (!product) {
          throw new Error("Продукт не найден");
        }
        return product;
      });
    }

    // Проверяем, есть ли продукт в кэше всех продуктов
    if (cache.products) {
      const product = cache.products.find(
        (p) => p.MaterialId.toString() === id.toString()
      );
      if (product) {
        return product;
      }
    }

    const url = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.PRODUCT_DETAILS.replace(":id", id)}`;
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

    // Используем кэширование для каталога
    return fetchApi(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATALOG}`,
      {},
      "catalog"
    );
  },

  /**
   * Фильтрация продуктов по категории
   * @param {Object} category - Объект с параметрами категории
   * @returns {Promise<Array>} - Отфильтрованный список продуктов
   */
  filterProductsByCategory: async (category) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов загружаем все продукты и фильтруем на клиенте
      const catalogData = await fetchApi(API_CONFIG.LOCAL_JSON.CATALOG);
      const data = await fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS);

      return ApiService._filterProductsByCategory(data, catalogData, category);
    }

    // Создаем ключ для кэша на основе параметров категории
    const categoryKey = ApiService._createCategoryKey(category);

    // Проверяем, есть ли уже отфильтрованные продукты в кэше
    if (cache.categoryProducts[categoryKey]) {
      console.log(
        `Возвращаем кэшированные продукты для категории: ${categoryKey}`
      );
      return cache.categoryProducts[categoryKey];
    }

    try {
      // Получаем данные каталога
      const catalogData = await ApiService.getCatalog();

      // Получаем все продукты (используем кэш, если возможно)
      const products = await fetchApi(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
        {},
        "products"
      );

      // Фильтруем продукты
      const filteredProducts = ApiService._filterProductsByCategory(
        products,
        catalogData,
        category
      );

      // Сохраняем отфильтрованные продукты в кэш
      cache.categoryProducts[categoryKey] = filteredProducts;

      return filteredProducts;
    } catch (error) {
      console.error("Ошибка при фильтрации продуктов:", error);
      throw error;
    }
  },

  /**
   * Вспомогательный метод для создания ключа кэша категории
   * @param {Object} category - Объект с параметрами категории
   * @returns {string} - Ключ для кэша
   * @private
   */
  _createCategoryKey: (category) => {
    let key = "";
    if (category.department) key += `d${category.department}_`;
    if (category.section) key += `s${category.section}_`;
    if (category.subsection) key += `ss${category.subsection}_`;
    if (category.group) key += `g${category.group}`;
    return key || "all";
  },

  /**
   * Вспомогательный метод для фильтрации продуктов по категории
   * @param {Array} products - Список продуктов
   * @param {Array} catalogData - Данные каталога
   * @param {Object} category - Объект с параметрами категории
   * @returns {Array} - Отфильтрованный список продуктов
   * @private
   */
  _filterProductsByCategory: (products, catalogData, category) => {
    let filtered = products;
    console.log("Фильтрация продуктов по категории:", category);

    // Находим связанные категории
    const relatedCategories = ApiService._findRelatedCategories(
      catalogData,
      category
    );

    // Фильтруем продукты по связанным категориям
    if (relatedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        relatedCategories.includes(product.MaterialTreeId)
      );
    }

    console.log("Отфильтрованные продукты:", filtered.length);
    return filtered;
  },

  /**
   * Вспомогательный метод для поиска связанных категорий
   * @param {Array} catalogData - Данные каталога
   * @param {Object} category - Объект с параметрами категории
   * @returns {Array} - Список ID связанных категорий
   * @private
   */
  _findRelatedCategories: (catalogData, category) => {
    const relatedCategories = [];

    if (category.group) {
      // Если выбрана группа, добавляем только её
      const groupId = parseInt(category.group);
      relatedCategories.push(groupId);
    } else if (category.subsection) {
      // Если выбран подраздел, добавляем его и все его группы
      const subsectionId = parseInt(category.subsection);
      relatedCategories.push(subsectionId);

      // Находим все группы подраздела
      const groups = catalogData.filter((item) => item.ParId === subsectionId);
      groups.forEach((group) => {
        relatedCategories.push(group.MaterialTreeId);
      });
    } else if (category.section) {
      // Если выбран раздел, добавляем его, все его подразделы и группы
      const sectionId = parseInt(category.section);
      relatedCategories.push(sectionId);

      // Находим все подразделы раздела
      const subsections = catalogData.filter(
        (item) => item.ParId === sectionId
      );
      subsections.forEach((subsection) => {
        relatedCategories.push(subsection.MaterialTreeId);

        // Находим все группы подраздела
        const groups = catalogData.filter(
          (item) => item.ParId === subsection.MaterialTreeId
        );
        groups.forEach((group) => {
          relatedCategories.push(group.MaterialTreeId);
        });
      });
    } else if (category.department) {
      // Если выбран отдел, добавляем его, все его разделы, подразделы и группы
      const departmentId = parseInt(category.department);
      relatedCategories.push(departmentId);

      // Находим все разделы отдела
      const sections = catalogData.filter(
        (item) => item.ParId === departmentId
      );
      sections.forEach((section) => {
        relatedCategories.push(section.MaterialTreeId);

        // Находим все подразделы раздела
        const subsections = catalogData.filter(
          (item) => item.ParId === section.MaterialTreeId
        );
        subsections.forEach((subsection) => {
          relatedCategories.push(subsection.MaterialTreeId);

          // Находим все группы подраздела
          const groups = catalogData.filter(
            (item) => item.ParId === subsection.MaterialTreeId
          );
          groups.forEach((group) => {
            relatedCategories.push(group.MaterialTreeId);
          });
        });
      });
    }

    return relatedCategories;
  },

  /**
   * Поиск продуктов по запросу
   * @param {string} query - Поисковый запрос
   * @returns {Promise<Array>} - Результаты поиска
   */
  searchProducts: async (query) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов загружаем все продукты и фильтруем на клиенте
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS).then((data) => {
        if (!query) return data;

        const lowerQuery = query.toLowerCase();
        return data.filter((product) =>
          product.MaterialName.toLowerCase().includes(lowerQuery)
        );
      });
    }

    // Если у нас уже есть все продукты в кэше, используем их для поиска
    if (cache.products) {
      if (!query) return cache.products;

      const lowerQuery = query.toLowerCase();
      return cache.products.filter(
        (product) =>
          product.MaterialName &&
          product.MaterialName.toLowerCase().includes(lowerQuery)
      );
    }

    // Для API получаем все продукты и фильтруем на клиенте
    const products = await fetchApi(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
      {},
      "products"
    );

    if (!query) return products;

    const lowerQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.MaterialName &&
        product.MaterialName.toLowerCase().includes(lowerQuery)
    );
  },
};

export default ApiService;
