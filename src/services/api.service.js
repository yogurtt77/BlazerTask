import API_CONFIG from "../config/api";

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
      // Сначала загружаем каталог, чтобы использовать его для фильтрации
      return fetchApi(API_CONFIG.LOCAL_JSON.CATALOG).then((catalogData) => {
        return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS).then((data) => {
          let filtered = data;
          console.log("Фильтрация продуктов по категории:", category);

          if (category.department) {
            console.log("Фильтрация по отделу:", category.department);
            const departmentId = parseInt(category.department);

            // Находим все категории, которые относятся к выбранному отделу
            const relatedCategories = [];

            // Добавляем сам отдел
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

            console.log("Связанные категории для отдела:", relatedCategories);

            // Фильтруем продукты по связанным категориям
            filtered = filtered.filter((product) =>
              relatedCategories.includes(product.MaterialTreeId)
            );
          }

          if (category.section) {
            console.log("Фильтрация по разделу:", category.section);
            const sectionId = parseInt(category.section);

            // Находим все категории, которые относятся к выбранному разделу
            const relatedCategories = [];

            // Добавляем сам раздел
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

            console.log("Связанные категории для раздела:", relatedCategories);

            // Фильтруем продукты по связанным категориям
            filtered = filtered.filter((product) =>
              relatedCategories.includes(product.MaterialTreeId)
            );
          }

          if (category.subsection) {
            console.log("Фильтрация по подразделу:", category.subsection);
            const subsectionId = parseInt(category.subsection);

            // Находим все категории, которые относятся к выбранному подразделу
            const relatedCategories = [];

            // Добавляем сам подраздел
            relatedCategories.push(subsectionId);

            // Находим все группы подраздела
            const groups = catalogData.filter(
              (item) => item.ParId === subsectionId
            );
            groups.forEach((group) => {
              relatedCategories.push(group.MaterialTreeId);
            });

            console.log(
              "Связанные категории для подраздела:",
              relatedCategories
            );

            // Фильтруем продукты по связанным категориям
            filtered = filtered.filter((product) =>
              relatedCategories.includes(product.MaterialTreeId)
            );
          }

          if (category.group) {
            console.log("Фильтрация по группе:", category.group);
            const groupId = parseInt(category.group);

            // Фильтруем продукты по группе
            filtered = filtered.filter(
              (product) => product.MaterialTreeId === groupId
            );
          }

          console.log("Отфильтрованные продукты:", filtered);
          return filtered;
        });
      });
    }

    // Для реального API будем использовать query параметры
    const queryParams = new URLSearchParams();
    if (category.department)
      queryParams.append("department", category.department);
    if (category.section) queryParams.append("section", category.section);
    if (category.subsection)
      queryParams.append("subsection", category.subsection);
    if (category.group) queryParams.append("group", category.group);

    const url = `${API_CONFIG.BASE_URL}${
      API_CONFIG.ENDPOINTS.PRODUCTS
    }?${queryParams.toString()}`;
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
      return fetchApi(API_CONFIG.LOCAL_JSON.PRODUCTS).then((data) => {
        if (!query) return data;

        const lowerQuery = query.toLowerCase();
        return data.filter((product) =>
          product.MaterialName.toLowerCase().includes(lowerQuery)
        );
      });
    }

    const url = `${API_CONFIG.BASE_URL}${
      API_CONFIG.ENDPOINTS.PRODUCTS
    }?search=${encodeURIComponent(query)}`;
    return fetchApi(url);
  },
};

export default ApiService;
