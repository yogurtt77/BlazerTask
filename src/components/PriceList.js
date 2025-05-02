import React, { useState } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { products } from "../data/products";

const PriceListContainer = styled.div`
  padding: 24px;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 12px;
    display: none; /* Скрываем заголовок на мобильных, так как он уже есть в шапке */
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;

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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AddPriceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 24px;

  svg {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const PriceList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
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

      <AddPriceButton>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 3.33334V12.6667"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.33334 8H12.6667"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Добавить ценовое предложение
      </AddPriceButton>

      <SearchBar />

      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
          />
        ))}
      </ProductGrid>
    </PriceListContainer>
  );
};

export default PriceList;
