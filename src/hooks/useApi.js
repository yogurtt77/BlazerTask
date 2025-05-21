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
