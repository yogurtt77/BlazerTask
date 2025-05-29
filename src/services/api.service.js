import API_CONFIG from "../config/api";

// Кэш для хранения данных
const cache = {
  catalog: null,
  products: null,
  categoryProducts: {},
  paginatedProducts: {}, // Кэш для пагинированных данных
  photos: null, // Кэш для фотографий
  productPhotos: {}, // Кэш для фотографий конкретных продуктов
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

    // Если у нас уже есть кэшированные продукты, возвращаем их
    if (cache.products) {
      return cache.products;
    }

    try {
      // Получаем все продукты без фильтрации
      const products = await fetchApi(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
        {},
        "products"
      );

      return products;
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
      throw error;
    }
  },

  /**
   * Получить список продуктов с пагинацией
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} pageSize - Размер страницы
   * @returns {Promise<Object>} - Объект с данными пагинации и списком продуктов
   */
  getProductsWithPagination: async (page = 1, pageSize = 20) => {
    // Создаем ключ для кэша пагинированных данных
    const paginationKey = `page_${page}_size_${pageSize}`;

    // Проверяем, есть ли данные в кэше
    if (cache.paginatedProducts[paginationKey]) {
      console.log(`Данные пагинации получены из кэша: ${paginationKey}`);
      return cache.paginatedProducts[paginationKey];
    }

    try {
      // Получаем все продукты (используем кэш, если возможно)
      const allProducts = await ApiService.getProducts();

      // Вычисляем общее количество страниц
      const totalItems = allProducts.length;
      const totalPages = Math.ceil(totalItems / pageSize);

      // Вычисляем индексы для текущей страницы
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);

      // Получаем продукты для текущей страницы
      const paginatedProducts = allProducts.slice(startIndex, endIndex);

      // Формируем результат
      const result = {
        data: paginatedProducts,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      // Сохраняем результат в кэш
      cache.paginatedProducts[paginationKey] = result;

      return result;
    } catch (error) {
      console.error("Ошибка при получении продуктов с пагинацией:", error);
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
   * Фильтрация продуктов по категории с пагинацией
   * @param {Object} category - Объект с параметрами категории
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} pageSize - Размер страницы
   * @returns {Promise<Object>} - Объект с данными пагинации и отфильтрованным списком продуктов
   */
  filterProductsByCategoryWithPagination: async (
    category,
    page = 1,
    pageSize = 20
  ) => {
    try {
      // Получаем все отфильтрованные продукты
      const filteredProducts = await ApiService.filterProductsByCategory(
        category
      );

      // Вычисляем общее количество страниц
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / pageSize);

      // Вычисляем индексы для текущей страницы
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);

      // Получаем продукты для текущей страницы
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      // Формируем результат
      return {
        data: paginatedProducts,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Ошибка при фильтрации продуктов с пагинацией:", error);
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

      // Добавляем все продукты, которые относятся к этой группе
      // Продукты имеют ParId равный ID группы
      const products = catalogData.filter((item) => item.ParId === groupId);
      products.forEach((product) => {
        relatedCategories.push(product.MaterialTreeId);
      });
    } else if (category.subsection) {
      // Если выбран подраздел, добавляем его
      const subsectionId = parseInt(category.subsection);
      relatedCategories.push(subsectionId);

      // Находим все группы подраздела
      const groups = catalogData.filter((item) => item.ParId === subsectionId);
      groups.forEach((group) => {
        relatedCategories.push(group.MaterialTreeId);

        // Добавляем все продукты, которые относятся к этим группам
        const products = catalogData.filter(
          (item) => item.ParId === group.MaterialTreeId
        );
        products.forEach((product) => {
          relatedCategories.push(product.MaterialTreeId);
        });
      });
    } else if (category.section) {
      // Если выбран раздел, добавляем его
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

          // Добавляем все продукты, которые относятся к этим группам
          const products = catalogData.filter(
            (item) => item.ParId === group.MaterialTreeId
          );
          products.forEach((product) => {
            relatedCategories.push(product.MaterialTreeId);
          });
        });
      });
    } else if (category.department) {
      // Если выбран отдел, добавляем его
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

            // Добавляем все продукты, которые относятся к этим группам
            const products = catalogData.filter(
              (item) => item.ParId === group.MaterialTreeId
            );
            products.forEach((product) => {
              relatedCategories.push(product.MaterialTreeId);
            });
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

  /**
   * Поиск продуктов по запросу с пагинацией
   * @param {string} query - Поисковый запрос
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} pageSize - Размер страницы
   * @returns {Promise<Object>} - Объект с данными пагинации и результатами поиска
   */
  searchProductsWithPagination: async (query, page = 1, pageSize = 20) => {
    try {
      // Получаем все результаты поиска
      const searchResults = await ApiService.searchProducts(query);

      // Вычисляем общее количество страниц
      const totalItems = searchResults.length;
      const totalPages = Math.ceil(totalItems / pageSize);

      // Вычисляем индексы для текущей страницы
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);

      // Получаем продукты для текущей страницы
      const paginatedResults = searchResults.slice(startIndex, endIndex);

      // Формируем результат
      return {
        data: paginatedResults,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Ошибка при поиске продуктов с пагинацией:", error);
      throw error;
    }
  },

  /**
   * Поиск продуктов по запросу с фильтрацией по категории
   * @param {string} query - Поисковый запрос
   * @param {Object} category - Объект с параметрами категории
   * @returns {Promise<Array>} - Результаты поиска с фильтрацией
   */
  searchProductsWithCategory: async (query, category) => {
    try {
      // Сначала получаем отфильтрованные по категории продукты
      const filteredProducts = await ApiService.filterProductsByCategory(
        category
      );

      // Если нет поискового запроса, возвращаем все отфильтрованные продукты
      if (!query) return filteredProducts;

      // Фильтруем по поисковому запросу
      const lowerQuery = query.toLowerCase();
      return filteredProducts.filter(
        (product) =>
          product.MaterialName &&
          product.MaterialName.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error(
        "Ошибка при поиске продуктов с фильтрацией по категории:",
        error
      );
      throw error;
    }
  },

  /**
   * Поиск продуктов по запросу с фильтрацией по категории и пагинацией
   * @param {string} query - Поисковый запрос
   * @param {Object} category - Объект с параметрами категории
   * @param {number} page - Номер страницы (начиная с 1)
   * @param {number} pageSize - Размер страницы
   * @returns {Promise<Object>} - Объект с данными пагинации и результатами поиска с фильтрацией
   */
  searchProductsWithCategoryAndPagination: async (
    query,
    category,
    page = 1,
    pageSize = 20
  ) => {
    try {
      // Получаем все результаты поиска с фильтрацией по категории
      const searchResults = await ApiService.searchProductsWithCategory(
        query,
        category
      );

      // Вычисляем общее количество страниц
      const totalItems = searchResults.length;
      const totalPages = Math.ceil(totalItems / pageSize);

      // Вычисляем индексы для текущей страницы
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);

      // Получаем продукты для текущей страницы
      const paginatedResults = searchResults.slice(startIndex, endIndex);

      // Формируем результат
      return {
        data: paginatedResults,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error(
        "Ошибка при поиске продуктов с фильтрацией и пагинацией:",
        error
      );
      throw error;
    }
  },

  /**
   * Получить все фотографии товаров
   * @returns {Promise<Array>} - Список фотографий
   */
  getPhotos: async () => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов возвращаем пустой массив
      return [];
    }

    // Если у нас уже есть кэшированные фотографии, возвращаем их
    if (cache.photos) {
      return cache.photos;
    }

    try {
      const photos = await fetchApi(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHOTOS}`,
        {},
        "photos"
      );

      return photos;
    } catch (error) {
      console.error("Ошибка при получении фотографий:", error);
      return []; // Возвращаем пустой массив при ошибке
    }
  },

  /**
   * Получить фотографии для конкретного товара
   * @param {number|string} materialId - ID товара
   * @returns {Promise<Array>} - Список фотографий товара
   */
  getProductPhotos: async (materialId) => {
    if (API_CONFIG.USE_LOCAL_JSON) {
      // Для локальных JSON-файлов возвращаем пустой массив
      return [];
    }

    const materialIdStr = materialId.toString();

    // Проверяем, есть ли фотографии для этого товара в кэше
    if (cache.productPhotos[materialIdStr]) {
      return cache.productPhotos[materialIdStr];
    }

    try {
      // Получаем все фотографии
      const allPhotos = await ApiService.getPhotos();

      // Фильтруем фотографии для конкретного товара
      const productPhotos = allPhotos.filter(
        (photo) => photo.MaterialId.toString() === materialIdStr
      );

      // Сохраняем в кэш
      cache.productPhotos[materialIdStr] = productPhotos;

      return productPhotos;
    } catch (error) {
      console.error(
        `Ошибка при получении фотографий для товара ${materialId}:`,
        error
      );
      return []; // Возвращаем пустой массив при ошибке
    }
  },

  /**
   * Получить первую фотографию товара (для карточки)
   * @param {number|string} materialId - ID товара
   * @returns {Promise<Object|null>} - Объект фотографии или null
   */
  getProductMainPhoto: async (materialId) => {
    try {
      const photos = await ApiService.getProductPhotos(materialId);
      return photos.length > 0 ? photos[0] : null;
    } catch (error) {
      console.error(
        `Ошибка при получении главной фотографии для товара ${materialId}:`,
        error
      );
      return null;
    }
  },
};

export default ApiService;
