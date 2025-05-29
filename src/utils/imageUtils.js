import API_CONFIG from "../config/api";

/**
 * Преобразует путь изображения из API в полный URL
 * @param {string} fileSrc - Путь к файлу из API (например, "~/Content/Images/Materials/img_56582.png")
 * @returns {string} - Полный URL изображения
 */
export const convertImagePath = (fileSrc) => {
  if (!fileSrc) {
    return null;
  }

  // Заменяем тильду на базовый URL для изображений
  if (fileSrc.startsWith("~/")) {
    return fileSrc.replace("~", API_CONFIG.IMAGES_BASE_URL);
  }

  // Если путь уже полный, возвращаем как есть
  if (fileSrc.startsWith("http")) {
    return fileSrc;
  }

  // Если путь относительный, добавляем базовый URL
  return `${API_CONFIG.IMAGES_BASE_URL}/${fileSrc}`;
};

/**
 * Проверяет, доступно ли изображение по URL
 * @param {string} imageUrl - URL изображения
 * @returns {Promise<boolean>} - true, если изображение доступно
 */
export const checkImageAvailability = async (imageUrl) => {
  if (!imageUrl) {
    return false;
  }

  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.warn(`Изображение недоступно: ${imageUrl}`, error);
    return false;
  }
};

/**
 * Получает URL изображения с проверкой доступности
 * @param {string} fileSrc - Путь к файлу из API
 * @param {string} fallbackUrl - Запасное изображение
 * @returns {Promise<string>} - URL изображения или запасное изображение
 */
export const getImageUrl = async (fileSrc, fallbackUrl = "/images/CardImage.png") => {
  const imageUrl = convertImagePath(fileSrc);
  
  if (!imageUrl) {
    return fallbackUrl;
  }

  const isAvailable = await checkImageAvailability(imageUrl);
  return isAvailable ? imageUrl : fallbackUrl;
};

/**
 * Создает объект изображения с обработкой ошибок
 * @param {string} fileSrc - Путь к файлу из API
 * @param {string} alt - Альтернативный текст
 * @param {string} fallbackUrl - Запасное изображение
 * @returns {Object} - Объект с URL изображения и обработчиком ошибок
 */
export const createImageObject = (fileSrc, alt = "", fallbackUrl = "/images/CardImage.png") => {
  const imageUrl = convertImagePath(fileSrc);
  
  return {
    src: imageUrl || fallbackUrl,
    alt,
    onError: (e) => {
      if (e.target.src !== fallbackUrl) {
        e.target.onerror = null; // Предотвращаем бесконечную рекурсию
        e.target.src = fallbackUrl;
      }
    }
  };
};
