import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных из JSON-файла
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/products.json");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Ошибка при загрузке данных:", err);
      }
    };

    fetchProducts();
  }, []);

  // Фильтрация продуктов при изменении выбранной категории или поискового запроса
  useEffect(() => {
    if (products.length === 0) return;

    // Начинаем с полного списка продуктов
    let filtered = products;

    // Фильтрация по категории
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        // Фильтрация по отделу
        if (
          selectedCategory.department &&
          product.department !== selectedCategory.department
        ) {
          return false;
        }

        // Фильтрация по разделу
        if (
          selectedCategory.section &&
          product.section !== selectedCategory.section
        ) {
          return false;
        }

        // Фильтрация по подразделу
        if (
          selectedCategory.subsection &&
          product.subsection !== selectedCategory.subsection
        ) {
          return false;
        }

        // Фильтрация по группе
        if (
          selectedCategory.group &&
          product.group !== selectedCategory.group
        ) {
          return false;
        }

        return true;
      });
    }

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        // Поиск по названию товара
        if (product.title.toLowerCase().includes(query)) {
          return true;
        }

        // Можно добавить поиск по другим полям, если необходимо
        // Например, по категории, цене и т.д.

        return false;
      });
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Закрываем каталог после выбора категории
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (selectedProduct) {
    return (
      <ProductDetail product={selectedProduct} onBack={handleBackToList} />
    );
  }

  return (
    <PriceListContainer>
      <Title>Прайс листы</Title>

      <Description>
        Здесь Вы можете находить ценовые предложения наших партнеров. Если Вы
        являетесь поставщиком, то <a href="#">добавьте ценовое предложение</a>,
        это бесплатно.
      </Description>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          Загрузка данных...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Ошибка: {error}. Пожалуйста, обновите страницу или попробуйте позже.
        </div>
      )}

      {(selectedCategory || searchQuery) && (
        <ActiveFilters>
          {selectedCategory && (
            <FilterTag>
              {selectedCategory.group
                ? `Группа: ${selectedCategory.group}`
                : selectedCategory.subsection
                ? `Подраздел: ${selectedCategory.subsection}`
                : selectedCategory.section
                ? `Раздел: ${selectedCategory.section}`
                : `Отдел: ${selectedCategory.department}`}
              <button onClick={handleClearFilter}>×</button>
            </FilterTag>
          )}

          {searchQuery && (
            <FilterTag>
              Поиск: {searchQuery}
              <button onClick={() => setSearchQuery("")}>×</button>
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
              style={{ marginTop: "24px", textAlign: "center", color: "#666" }}
            >
              По выбранным критериям товары не найдены
            </div>
          ) : (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
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
