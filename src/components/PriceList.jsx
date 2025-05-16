import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import ApiService from "../services/api.service";

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

const PriceList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных из API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Ошибка при загрузке данных:", err);
      }
    };

    fetchProducts();
  }, []);

  // Сбрасываем фильтры при монтировании компонента
  useEffect(() => {
    // Функционал фильтрации теперь реализован в обработчиках событий
    // через вызовы API
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    // Закрываем каталог после выбора категории

    try {
      setLoading(true);
      const filteredData = await ApiService.filterProductsByCategory(category);
      setFilteredProducts(filteredData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Ошибка при фильтрации данных:", err);
    }
  };

  const handleClearFilter = async () => {
    setSelectedCategory(null);

    try {
      setLoading(true);
      // Если есть поисковый запрос, применяем только его
      if (searchQuery) {
        const searchResults = await ApiService.searchProducts(searchQuery);
        setFilteredProducts(searchResults);
      } else {
        // Иначе загружаем все продукты
        const allProducts = await ApiService.getProducts();
        setFilteredProducts(allProducts);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Ошибка при сбросе фильтра:", err);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    try {
      setLoading(true);
      const searchResults = await ApiService.searchProducts(query);
      setFilteredProducts(searchResults);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Ошибка при поиске:", err);
    }
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

      {loading && (
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
          Ошибка: {error}. Пожалуйста, обновите страницу или попробуйте позже.
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

      <SearchBar
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      />

      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div
              role="status"
              aria-live="polite"
              style={{ marginTop: "24px", textAlign: "center", color: "#666" }}
            >
              По выбранным критериям товары не найдены
            </div>
          ) : (
            <ProductGrid as="ul" aria-label="Список товаров">
              {filteredProducts.map((product) => (
                <li key={product.id} style={{ listStyle: "none" }}>
                  <ProductCard
                    product={product}
                    onProductClick={handleProductClick}
                  />
                </li>
              ))}
            </ProductGrid>
          )}
        </>
      )}
    </PriceListContainer>
  );
};

PriceList.displayName = "PriceList";

export default PriceList;
