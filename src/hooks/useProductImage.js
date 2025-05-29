import { useState, useEffect } from "react";
import ApiService from "../services/api.service";
import { convertImagePath } from "../utils/imageUtils";

/**
 * Хук для загрузки изображения товара
 * @param {number|string} materialId - ID товара
 * @returns {Object} - Объект с URL изображения и состоянием загрузки
 */
export const useProductImage = (materialId) => {
  const [imageUrl, setImageUrl] = useState("/images/placeholder.png");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!materialId) {
      setImageUrl("/images/placeholder.png");
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Получаем главную фотографию товара
        const photo = await ApiService.getProductMainPhoto(materialId);

        if (photo && photo.FileSrc) {
          const convertedUrl = convertImagePath(photo.FileSrc);

          // Проверяем, что изображение действительно загружается
          const img = new Image();
          img.onload = () => {
            setImageUrl(convertedUrl);
            setIsLoading(false);
          };
          img.onerror = () => {
            setImageUrl("/images/placeholder.png"); // Показываем заглушку при ошибке
            setIsLoading(false);
            setHasError(true);
          };
          img.src = convertedUrl;
        } else {
          // Если фотография не найдена, показываем заглушку
          setImageUrl("/images/placeholder.png");
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          `Ошибка при загрузке изображения для товара ${materialId}:`,
          error
        );
        setImageUrl("/images/placeholder.png"); // Показываем заглушку при ошибке
        setIsLoading(false);
        setHasError(true);
      }
    };

    loadImage();
  }, [materialId]);

  return {
    imageUrl,
    isLoading,
    hasError,
  };
};

/**
 * Хук для загрузки всех изображений товара
 * @param {number|string} materialId - ID товара
 * @returns {Object} - Объект с массивом изображений и состоянием загрузки
 */
export const useProductImages = (materialId) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!materialId) {
      setImages([
        {
          thumbnail: "/images/placeholder.png",
          full: "/images/placeholder.png",
          alt: "Изображение товара",
        },
      ]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const loadImages = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Получаем все фотографии товара
        const photos = await ApiService.getProductPhotos(materialId);

        if (photos && photos.length > 0) {
          const imagePromises = photos.map((photo, index) => {
            return new Promise((resolve) => {
              const convertedUrl = convertImagePath(photo.FileSrc);

              // Проверяем, что изображение действительно загружается
              const img = new Image();
              img.onload = () => {
                resolve({
                  thumbnail: convertedUrl,
                  full: convertedUrl,
                  alt: `Изображение товара ${index + 1}`,
                  fileName: photo.FileName,
                });
              };
              img.onerror = () => {
                resolve({
                  thumbnail: "/images/placeholder.png",
                  full: "/images/placeholder.png",
                  alt: `Изображение товара ${index + 1}`,
                  fileName: photo.FileName,
                  isPlaceholder: true,
                });
              };
              img.src = convertedUrl;
            });
          });

          const loadedImages = await Promise.all(imagePromises);

          // Если есть хотя бы одно реальное изображение, показываем все
          // Иначе показываем только заглушку
          const realImages = loadedImages.filter((img) => !img.isPlaceholder);

          if (realImages.length > 0) {
            setImages(loadedImages); // Показываем все изображения (реальные + заглушки)
          } else {
            // Если нет реальных изображений, показываем только одну заглушку
            setImages([
              {
                thumbnail: "/images/placeholder.png",
                full: "/images/placeholder.png",
                alt: "Изображение товара",
              },
            ]);
          }
        } else {
          // Если фотографии не найдены, показываем заглушку
          setImages([
            {
              thumbnail: "/images/placeholder.png",
              full: "/images/placeholder.png",
              alt: "Изображение товара",
            },
          ]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error(
          `Ошибка при загрузке изображений для товара ${materialId}:`,
          error
        );
        setImages([
          {
            thumbnail: "/images/placeholder.png",
            full: "/images/placeholder.png",
            alt: "Изображение товара",
          },
        ]);
        setIsLoading(false);
        setHasError(true);
      }
    };

    loadImages();
  }, [materialId]);

  return {
    images,
    isLoading,
    hasError,
  };
};
