import { QueryClient } from '@tanstack/react-query';

// Создаем экземпляр QueryClient с настройками
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные считаются устаревшими через 5 минут
      staleTime: 5 * 60 * 1000,
      // Повторять запрос при ошибке до 3 раз
      retry: 3,
      // Кэшировать данные в течение 10 минут
      cacheTime: 10 * 60 * 1000,
      // Не обновлять данные автоматически при возвращении на страницу
      refetchOnWindowFocus: false,
      // Не обновлять данные автоматически при восстановлении соединения
      refetchOnReconnect: false,
    },
  },
});
