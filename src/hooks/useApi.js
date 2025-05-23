import { useQuery, useQueryClient } from "@tanstack/react-query";
import ApiService from "../services/api.service";

/**
 * Хук для получения всех продуктов
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса
 */
export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ApiService.getProducts(),
    ...options,
  });
};

/**
 * Хук для получения продуктов с пагинацией
 * @param {number} page - Номер страницы
 * @param {number} pageSize - Размер страницы
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса с пагинацией
 */
export const usePaginatedProducts = (page = 1, pageSize = 20, options = {}) => {
  return useQuery({
    queryKey: ["paginatedProducts", page, pageSize],
    queryFn: () => ApiService.getProductsWithPagination(page, pageSize),
    keepPreviousData: true, // Сохраняем предыдущие данные при изменении страницы
    ...options,
  });
};

/**
 * Хук для получения каталога
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса
 */
export const useCatalog = (options = {}) => {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: () => ApiService.getCatalog(),
    ...options,
  });
};

/**
 * Хук для фильтрации продуктов по категории
 * @param {Object} category - Категория для фильтрации
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса
 */
export const useFilteredProducts = (category, options = {}) => {
  const queryClient = useQueryClient();

  // Создаем ключ запроса на основе всех параметров категории
  const queryKey = [
    "filteredProducts",
    category?.department,
    category?.section,
    category?.subsection,
    category?.group,
  ];

  return useQuery({
    queryKey: queryKey,
    queryFn: () => ApiService.filterProductsByCategory(category),
    // Если категория не выбрана, используем все продукты из кэша
    enabled:
      !!category &&
      (!!category.department ||
        !!category.section ||
        !!category.subsection ||
        !!category.group),
    initialData: () => {
      // Если категория не выбрана, возвращаем все продукты из кэша
      if (
        !category ||
        (!category.department &&
          !category.section &&
          !category.subsection &&
          !category.group)
      ) {
        return queryClient.getQueryData(["products"]);
      }
      return undefined;
    },
    ...options,
  });
};

/**
 * Хук для фильтрации продуктов по категории с пагинацией
 * @param {Object} category - Категория для фильтрации
 * @param {number} page - Номер страницы
 * @param {number} pageSize - Размер страницы
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса с пагинацией
 */
export const usePaginatedFilteredProducts = (
  category,
  page = 1,
  pageSize = 20,
  options = {}
) => {
  // Создаем ключ запроса на основе всех параметров
  const queryKey = [
    "paginatedFilteredProducts",
    category?.department,
    category?.section,
    category?.subsection,
    category?.group,
    page,
    pageSize,
  ];

  return useQuery({
    queryKey: queryKey,
    queryFn: () =>
      ApiService.filterProductsByCategoryWithPagination(
        category,
        page,
        pageSize
      ),
    // Не выполнять запрос, если категория не выбрана
    enabled:
      !!category &&
      (!!category.department ||
        !!category.section ||
        !!category.subsection ||
        !!category.group),
    keepPreviousData: true, // Сохраняем предыдущие данные при изменении страницы
    ...options,
  });
};

/**
 * Хук для поиска продуктов
 * @param {string} query - Поисковый запрос
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса
 */
export const useSearchProducts = (query, options = {}) => {
  return useQuery({
    queryKey: ["searchProducts", query],
    queryFn: () => ApiService.searchProducts(query),
    // Не выполнять запрос, если поисковый запрос пустой
    enabled: !!query,
    ...options,
  });
};

/**
 * Хук для поиска продуктов с пагинацией
 * @param {string} query - Поисковый запрос
 * @param {number} page - Номер страницы
 * @param {number} pageSize - Размер страницы
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса с пагинацией
 */
export const usePaginatedSearchProducts = (
  query,
  page = 1,
  pageSize = 20,
  options = {}
) => {
  return useQuery({
    queryKey: ["paginatedSearchProducts", query, page, pageSize],
    queryFn: () =>
      ApiService.searchProductsWithPagination(query, page, pageSize),
    // Не выполнять запрос, если поисковый запрос пустой
    enabled: !!query,
    keepPreviousData: true, // Сохраняем предыдущие данные при изменении страницы
    ...options,
  });
};

/**
 * Хук для поиска продуктов с фильтрацией по категории и пагинацией
 * @param {string} query - Поисковый запрос
 * @param {Object} category - Объект с параметрами категории
 * @param {number} page - Номер страницы
 * @param {number} pageSize - Размер страницы
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса с пагинацией
 */
export const usePaginatedSearchWithCategory = (
  query,
  category,
  page = 1,
  pageSize = 20,
  options = {}
) => {
  // Создаем ключ запроса на основе всех параметров
  const queryKey = [
    "paginatedSearchWithCategory",
    query,
    category?.department,
    category?.section,
    category?.subsection,
    category?.group,
    page,
    pageSize,
  ];

  return useQuery({
    queryKey: queryKey,
    queryFn: () =>
      ApiService.searchProductsWithCategoryAndPagination(
        query,
        category,
        page,
        pageSize
      ),
    // Не выполнять запрос, если категория не выбрана или поисковый запрос пустой
    enabled:
      !!query &&
      !!category &&
      (!!category.department ||
        !!category.section ||
        !!category.subsection ||
        !!category.group),
    keepPreviousData: true, // Сохраняем предыдущие данные при изменении страницы
    ...options,
  });
};

/**
 * Хук для получения детальной информации о продукте
 * @param {string} productId - ID продукта
 * @param {Object} options - Опции для useQuery
 * @returns {Object} - Результат запроса
 */
export const useProductDetails = (productId, options = {}) => {
  return useQuery({
    queryKey: ["productDetails", productId],
    queryFn: () => ApiService.getProductById(productId),
    // Не выполнять запрос, если ID продукта не указан
    enabled: !!productId,
    ...options,
  });
};
