import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBarHierarchical from "./SearchBarHierarchical";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import Pagination from "./Pagination";
import { useQueryClient } from "@tanstack/react-query";
import ApiService from "../services/api.service";
import {
  useProducts,
  useFilteredProducts,
  useSearchProducts,
  usePaginatedProducts,
  usePaginatedFilteredProducts,
  usePaginatedSearchProducts,
  usePaginatedSearchWithCategory,
} from "../hooks/useApi";

const PriceListContainer = styled.div`
  padding: 24px;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;
PriceListContainer.displayName = "PriceListContainer";

const Title = styled.h1`
  font-size: 42px;
  line-height: 150%;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 12px;
    display: none; /* Скрываем заголовок на мобильных, так как он уже есть в шапке */
  }
`;
Title.displayName = "Title";

const Description = styled.p`
  font-size: 17px;
  max-width: 656px;
  color: #666;
  margin-bottom: 24px;
  line-height: 150%;

  a {
    color: #0066cc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;
Description.displayName = "Description";

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;

  /* Все карточки в строке будут одинаковой высоты */
  & > * {
    height: 100%;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
ProductGrid.displayName = "ProductGrid";

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 16px;
`;
ActiveFilters.displayName = "ActiveFilters";

const FilterTag = styled.div`
  background-color: #f0f7ff;
  border: 1px solid #cce4ff;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  color: #0066cc;
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: none;
    border: none;
    color: #0066cc;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;
FilterTag.displayName = "FilterTag";

const InfoText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
`;
InfoText.displayName = "InfoText";

// Ключи для хранения состояния фильтров в localStorage
const STORAGE_KEYS = {
  CATEGORY: "priceList.selectedCategory",
  SEARCH: "priceList.searchQuery",
  PAGE: "priceList.currentPage",
};

// Функция для сохранения состояния фильтров
const saveFiltersState = (category, query, page) => {
  if (category) {
    localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(category));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CATEGORY);
  }

  if (query) {
    localStorage.setItem(STORAGE_KEYS.SEARCH, query);
  } else {
    localStorage.removeItem(STORAGE_KEYS.SEARCH);
  }

  localStorage.setItem(STORAGE_KEYS.PAGE, page.toString());
};

// Функция для загрузки состояния фильтров
const loadFiltersState = () => {
  try {
    const category = localStorage.getItem(STORAGE_KEYS.CATEGORY);
    const query = localStorage.getItem(STORAGE_KEYS.SEARCH) || "";
    const page = parseInt(localStorage.getItem(STORAGE_KEYS.PAGE) || "1", 10);

    return {
      category: category ? JSON.parse(category) : null,
      query,
      page,
    };
  } catch (error) {
    console.error("Ошибка при загрузке состояния фильтров:", error);
    return { category: null, query: "", page: 1 };
  }
};

const PriceList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Загружаем сохраненное состояние фильтров при инициализации
  const initialState = loadFiltersState();

  const [selectedCategory, setSelectedCategory] = useState(
    initialState.category
  );
  const [searchQuery, setSearchQuery] = useState(initialState.query);
  const [currentPage, setCurrentPage] = useState(initialState.page);
  const PAGE_SIZE = 20; // Размер страницы для пагинации

  // Получаем продукты с пагинацией
  const {
    data: paginatedData = {
      data: [],
      pagination: { totalItems: 0, totalPages: 1 },
    },
    isLoading: isLoadingPaginated,
    error: paginatedError,
    isFetching: isFetchingPaginated,
  } = usePaginatedProducts(currentPage, PAGE_SIZE, {
    // Не выполнять запрос, если выбрана категория или выполняется поиск
    enabled: !selectedCategory && !searchQuery,
  });

  // Получаем отфильтрованные продукты по категории с пагинацией
  const {
    data: paginatedFilteredData = {
      data: [],
      pagination: { totalItems: 0, totalPages: 1 },
    },
    isLoading: isLoadingFilteredPaginated,
    error: filteredPaginatedError,
    isFetching: isFetchingFilteredPaginated,
  } = usePaginatedFilteredProducts(selectedCategory, currentPage, PAGE_SIZE, {
    // Не выполнять запрос, если выполняется поиск
    enabled: !!selectedCategory && !searchQuery,
  });

  // Получаем результаты поиска с пагинацией
  const {
    data: paginatedSearchData = {
      data: [],
      pagination: { totalItems: 0, totalPages: 1 },
    },
    isLoading: isLoadingSearchPaginated,
    error: searchPaginatedError,
    isFetching: isFetchingSearchPaginated,
  } = usePaginatedSearchProducts(searchQuery, currentPage, PAGE_SIZE, {
    // Не выполнять запрос, если выбрана категория и есть поисковый запрос
    enabled: !!searchQuery && !selectedCategory,
  });

  // Получаем результаты поиска с фильтрацией по категории и пагинацией
  const {
    data: paginatedSearchWithCategoryData = {
      data: [],
      pagination: { totalItems: 0, totalPages: 1 },
    },
    isLoading: isLoadingSearchWithCategoryPaginated,
    error: searchWithCategoryPaginatedError,
    isFetching: isFetchingSearchWithCategoryPaginated,
  } = usePaginatedSearchWithCategory(
    searchQuery,
    selectedCategory,
    currentPage,
    PAGE_SIZE,
    {
      // Выполнять запрос только если есть и категория, и поисковый запрос
      enabled: !!searchQuery && !!selectedCategory,
    }
  );

  // Определяем, какие данные отображать
  const productsToDisplay =
    searchQuery && selectedCategory
      ? paginatedSearchWithCategoryData.data // Двойная фильтрация: поиск + категория
      : searchQuery
      ? paginatedSearchData.data // Только поиск
      : selectedCategory
      ? paginatedFilteredData.data // Только категория
      : paginatedData.data; // Все продукты

  // Определяем информацию о пагинации
  const paginationInfo =
    searchQuery && selectedCategory
      ? paginatedSearchWithCategoryData.pagination // Двойная фильтрация: поиск + категория
      : searchQuery
      ? paginatedSearchData.pagination // Только поиск
      : selectedCategory
      ? paginatedFilteredData.pagination // Только категория
      : paginatedData.pagination; // Все продукты

  // Общее состояние загрузки и ошибок
  const isLoading =
    isLoadingPaginated ||
    isLoadingFilteredPaginated ||
    isLoadingSearchPaginated ||
    isLoadingSearchWithCategoryPaginated;

  const isFetching =
    isFetchingPaginated ||
    isFetchingFilteredPaginated ||
    isFetchingSearchPaginated ||
    isFetchingSearchWithCategoryPaginated;

  const error =
    paginatedError ||
    filteredPaginatedError ||
    searchPaginatedError ||
    searchWithCategoryPaginatedError;

  // Эффект для обновления состояния фильтров при изменении URL
  useEffect(() => {
    // Загружаем сохраненное состояние фильтров
    const savedState = loadFiltersState();

    // Если есть сохраненные фильтры, применяем их
    if (
      savedState.category !== null ||
      savedState.query !== "" ||
      savedState.page !== 1
    ) {
      // Устанавливаем состояние только если оно отличается от текущего
      if (
        JSON.stringify(savedState.category) !== JSON.stringify(selectedCategory)
      ) {
        setSelectedCategory(savedState.category);
      }

      if (savedState.query !== searchQuery) {
        setSearchQuery(savedState.query);
      }

      if (savedState.page !== currentPage) {
        setCurrentPage(savedState.page);
      }
    }
  }, [navigate]); // Зависимость от navigate, чтобы эффект срабатывал при изменении URL

  // Предварительная загрузка следующей страницы
  useEffect(() => {
    // Если есть следующая страница, предварительно загружаем ее данные
    if (paginationInfo.hasNextPage) {
      const nextPage = currentPage + 1;

      if (!selectedCategory && !searchQuery) {
        // Предзагрузка следующей страницы всех продуктов
        queryClient.prefetchQuery({
          queryKey: ["paginatedProducts", nextPage, PAGE_SIZE],
          queryFn: () =>
            ApiService.getProductsWithPagination(nextPage, PAGE_SIZE),
        });
      } else if (selectedCategory && !searchQuery) {
        // Предзагрузка следующей страницы отфильтрованных продуктов
        queryClient.prefetchQuery({
          queryKey: [
            "paginatedFilteredProducts",
            selectedCategory?.department,
            selectedCategory?.section,
            selectedCategory?.subsection,
            selectedCategory?.group,
            nextPage,
            PAGE_SIZE,
          ],
          queryFn: () =>
            ApiService.filterProductsByCategoryWithPagination(
              selectedCategory,
              nextPage,
              PAGE_SIZE
            ),
        });
      } else if (searchQuery && !selectedCategory) {
        // Предзагрузка следующей страницы результатов поиска
        queryClient.prefetchQuery({
          queryKey: [
            "paginatedSearchProducts",
            searchQuery,
            nextPage,
            PAGE_SIZE,
          ],
          queryFn: () =>
            ApiService.searchProductsWithPagination(
              searchQuery,
              nextPage,
              PAGE_SIZE
            ),
        });
      } else if (searchQuery && selectedCategory) {
        // Предзагрузка следующей страницы результатов поиска с фильтрацией по категории
        queryClient.prefetchQuery({
          queryKey: [
            "paginatedSearchWithCategory",
            searchQuery,
            selectedCategory?.department,
            selectedCategory?.section,
            selectedCategory?.subsection,
            selectedCategory?.group,
            nextPage,
            PAGE_SIZE,
          ],
          queryFn: () =>
            ApiService.searchProductsWithCategoryAndPagination(
              searchQuery,
              selectedCategory,
              nextPage,
              PAGE_SIZE
            ),
        });
      }
    }
  }, [currentPage, paginationInfo, selectedCategory, searchQuery, queryClient]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.MaterialId}`);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Сбрасываем поисковый запрос при выборе категории
    setSearchQuery("");
    // Сбрасываем страницу при изменении категории
    setCurrentPage(1);

    // Сохраняем состояние фильтров
    saveFiltersState(category, "", 1);
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    // Сбрасываем страницу при очистке фильтра
    setCurrentPage(1);

    // Сохраняем состояние фильтров
    saveFiltersState(null, searchQuery, 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // НЕ сбрасываем категорию при поиске, чтобы работала двойная фильтрация
    // Сбрасываем страницу при поиске
    setCurrentPage(1);

    // Сохраняем состояние фильтров
    saveFiltersState(selectedCategory, query, 1);
  };

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Прокручиваем страницу вверх при изменении страницы
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Сохраняем состояние фильтров
    saveFiltersState(selectedCategory, searchQuery, page);
  };

  return (
    <PriceListContainer as="section">
      <Title as="h1">Прайс листы</Title>

      <Description>
        Здесь Вы можете находить ценовые предложения наших партнеров. Если Вы
        являетесь поставщиком, то{" "}
        <a href="#" aria-label="Добавить ценовое предложение">
          добавьте ценовое предложение
        </a>
        , это бесплатно.
      </Description>

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          style={{ textAlign: "center", padding: "40px 0" }}
        >
          Загрузка данных...
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{ textAlign: "center", padding: "20px", color: "red" }}
        >
          Ошибка: {error.message || "Произошла ошибка"}. Пожалуйста, обновите
          страницу или попробуйте позже.
        </div>
      )}

      {(selectedCategory || searchQuery) && (
        <ActiveFilters role="status" aria-live="polite">
          {selectedCategory && (
            <FilterTag>
              {selectedCategory.groupName
                ? `Группа: ${selectedCategory.groupName}`
                : selectedCategory.subsectionName
                ? `Подраздел: ${selectedCategory.subsectionName}`
                : selectedCategory.sectionName
                ? `Раздел: ${selectedCategory.sectionName}`
                : `Отдел: ${selectedCategory.departmentName}`}
              <button
                onClick={handleClearFilter}
                aria-label="Очистить фильтр категории"
              >
                ×
              </button>
            </FilterTag>
          )}

          {searchQuery && (
            <FilterTag>
              Поиск: {searchQuery}
              <button
                onClick={() => {
                  setSearchQuery("");
                  // Сохраняем состояние фильтров без поискового запроса
                  saveFiltersState(selectedCategory, "", currentPage);
                }}
                aria-label="Очистить поисковый запрос"
              >
                ×
              </button>
            </FilterTag>
          )}
        </ActiveFilters>
      )}

      {/* Отладочная информация о выбранной категории - скрыта в продакшн */}
      {false && selectedCategory && (
        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}>
          Выбрана категория:
          {selectedCategory.departmentName &&
            ` Отдел: ${selectedCategory.departmentName} (${selectedCategory.department})`}
          {selectedCategory.sectionName &&
            ` > Раздел: ${selectedCategory.sectionName} (${selectedCategory.section})`}
          {selectedCategory.subsectionName &&
            ` > Подраздел: ${selectedCategory.subsectionName} (${selectedCategory.subsection})`}
          {selectedCategory.groupName &&
            ` > Группа: ${selectedCategory.groupName} (${selectedCategory.group})`}
        </div>
      )}

      <SearchBarHierarchical
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      />

      {/* Показываем скелетоны во время первой загрузки */}
      {isLoading && (
        <ProductGrid as="ul" aria-label="Загрузка товаров">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <li key={`skeleton-${index}`} style={{ listStyle: "none" }}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ProductGrid>
      )}

      {/* Показываем ошибку, если она есть */}
      {error && (
        <div
          role="alert"
          style={{ textAlign: "center", padding: "20px", color: "red" }}
        >
          Ошибка: {error.message || "Произошла ошибка"}. Пожалуйста, обновите
          страницу или попробуйте позже.
        </div>
      )}

      {/* Показываем данные, когда они загружены */}
      {!isLoading && !error && (
        <>
          {productsToDisplay.length === 0 ? (
            <div
              role="status"
              aria-live="polite"
              style={{ marginTop: "24px", textAlign: "center", color: "#666" }}
            >
              По выбранным критериям товары не найдены
            </div>
          ) : (
            <>
              <ProductGrid as="ul" aria-label="Список товаров">
                {/* Показываем данные с индикацией загрузки при обновлении */}
                {productsToDisplay.map((product) => (
                  <li key={product.MaterialId} style={{ listStyle: "none" }}>
                    {isFetching && !isLoading ? (
                      <ProductCardSkeleton />
                    ) : (
                      <ProductCard
                        product={product}
                        onProductClick={handleProductClick}
                      />
                    )}
                  </li>
                ))}
              </ProductGrid>

              {/* Компонент пагинации */}
              {paginationInfo.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  totalItems={paginationInfo.totalItems}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </>
      )}
    </PriceListContainer>
  );
};

PriceList.displayName = "PriceList";

export default PriceList;
