import { QueryClient } from "@tanstack/react-query";

// Создаем экземпляр QueryClient с настройками
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные считаются устаревшими через 30 минут (увеличено для лучшего кэширования)
      staleTime: 30 * 60 * 1000,
      // Повторять запрос при ошибке до 3 раз
      retry: 3,
      // Кэшировать данные в течение 1 часа (увеличено для лучшего кэширования)
      cacheTime: 60 * 60 * 1000,
      // Не обновлять данные автоматически при возвращении на страницу
      refetchOnWindowFocus: false,
      // Не обновлять данные автоматически при восстановлении соединения
      refetchOnReconnect: false,
      // Показывать предыдущие данные при загрузке новых
      keepPreviousData: true,
      // Использовать данные из кэша при повторном монтировании компонента
      refetchOnMount: false,
      // Приоритет загрузки данных (высокий для первой страницы)
      networkMode: "offlineFirst",
    },
  },
});
