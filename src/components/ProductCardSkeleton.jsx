import React from "react";
import styled, { keyframes } from "styled-components";

// Анимация пульсации для скелетона
const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
`;
Card.displayName = "Card";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;
ImageContainer.displayName = "ImageContainer";

const ContentContainer = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
ContentContainer.displayName = "ContentContainer";

const TitleSkeleton = styled.div`
  height: 20px;
  width: 90%;
  background-color: #e0e0e0;
  margin-bottom: 16px;
  border-radius: 4px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;
TitleSkeleton.displayName = "TitleSkeleton";

const PriceSkeleton = styled.div`
  height: 16px;
  width: 60%;
  background-color: #e0e0e0;
  margin-bottom: 8px;
  border-radius: 4px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;
PriceSkeleton.displayName = "PriceSkeleton";

/**
 * Компонент скелетона для карточки товара
 * Отображается во время загрузки данных
 */
const ProductCardSkeleton = () => {
  return (
    <Card aria-busy="true" aria-label="Загрузка карточки товара">
      <ImageContainer />
      <ContentContainer>
        <TitleSkeleton />
        <PriceSkeleton />
        <PriceSkeleton />
        <PriceSkeleton />
      </ContentContainer>
    </Card>
  );
};

ProductCardSkeleton.displayName = "ProductCardSkeleton";

export default ProductCardSkeleton;
