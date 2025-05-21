import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import {
  useProducts,
  useFilteredProducts,
  useSearchProducts,
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

const PriceList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Максимальное количество карточек на главном экране без фильтрации
  const MAX_CARDS_ON_MAIN = 20;

  // Получаем все продукты с использованием React Query
  const {
    data: allProducts = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();

  // Получаем отфильтрованные продукты по категории с использованием React Query
  const {
    data: categoryFilteredProducts = [],
    isLoading: isLoadingFiltered,
    error: filteredError,
  } = useFilteredProducts(selectedCategory, {
    // Не выполнять запрос, если выполняется поиск
    enabled: !!selectedCategory && !searchQuery,
  });

  // Получаем результаты поиска с использованием React Query
  const {
    data: searchResults = [],
    isLoading: isLoadingSearch,
    error: searchError,
  } = useSearchProducts(searchQuery, {
    // Не выполнять запрос, если выбрана категория
    enabled: !!searchQuery && !selectedCategory,
  });

  // Определяем, какие данные отображать
  const productsToDisplay = searchQuery
    ? searchResults
    : selectedCategory
    ? categoryFilteredProducts
    : allProducts;

  // Общее состояние загрузки и ошибок
  const isLoading = isLoadingProducts || isLoadingFiltered || isLoadingSearch;
  const error = productsError || filteredError || searchError;

  const handleProductClick = (product) => {
    navigate(`/product/${product.MaterialId}`);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Сбрасываем поисковый запрос при выборе категории
    setSearchQuery("");
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Сбрасываем категорию при поиске
    setSelectedCategory(null);
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
              {selectedCategory.group
                ? `Группа: ${selectedCategory.group}`
                : selectedCategory.subsection
                ? `Подраздел: ${selectedCategory.subsection}`
                : selectedCategory.section
                ? `Раздел: ${selectedCategory.section}`
                : `Отдел: ${selectedCategory.department}`}
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
                onClick={() => setSearchQuery("")}
                aria-label="Очистить поисковый запрос"
              >
                ×
              </button>
            </FilterTag>
          )}
        </ActiveFilters>
      )}

      {/* Отладочная информация о выбранной категории */}
      {selectedCategory && (
        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}>
          Выбрана категория:
          {selectedCategory.department &&
            ` Отдел: ${selectedCategory.department}`}
          {selectedCategory.section && ` > Раздел: ${selectedCategory.section}`}
          {selectedCategory.subsection &&
            ` > Подраздел: ${selectedCategory.subsection}`}
          {selectedCategory.group && ` > Группа: ${selectedCategory.group}`}
        </div>
      )}

      <SearchBar
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      />

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
                {/* Если применена фильтрация или поиск, показываем все карточки, иначе ограничиваем до MAX_CARDS_ON_MAIN */}
                {(selectedCategory || searchQuery
                  ? productsToDisplay
                  : productsToDisplay.slice(0, MAX_CARDS_ON_MAIN)
                ).map((product) => (
                  <li key={product.MaterialId} style={{ listStyle: "none" }}>
                    <ProductCard
                      product={product}
                      onProductClick={handleProductClick}
                    />
                  </li>
                ))}
              </ProductGrid>

              {/* Показываем информацию только если нет фильтрации и поиска, и есть больше товаров, чем показано */}
              {!selectedCategory &&
                !searchQuery &&
                productsToDisplay.length > MAX_CARDS_ON_MAIN && (
                  <InfoText>
                    Показано {MAX_CARDS_ON_MAIN} из {productsToDisplay.length}{" "}
                    товаров
                  </InfoText>
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
