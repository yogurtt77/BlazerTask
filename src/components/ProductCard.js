import React from "react";
import styled from "styled-components";
import Button from "./Button";

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    height: 160px;
    padding: 12px;
  }
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 16px 16px;
  line-height: 1.4;
`;

const PriceInfo = styled.div`
  padding: 0 16px;
  margin-bottom: 8px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 13px;
  color: #666;
`;

const Price = styled.span`
  font-weight: ${(props) => (props.bold ? "600" : "400")};
`;

const SupplierInfo = styled.div`
  padding: 0 16px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #666;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 0 16px 16px;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const OrderButton = styled(Button)`
  flex: 1;
`;

const CartButton = styled(Button)`
  flex: 1;
`;

const ProductCard = ({ product, onProductClick }) => {
  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleButtonClick = (e) => {
    // Предотвращаем всплытие события клика, чтобы не срабатывал клик по карточке
    e.stopPropagation();
  };

  return (
    <Card onClick={handleCardClick}>
      <ImageContainer>
        <img src="https://via.placeholder.com/150" alt={product.title} />
      </ImageContainer>

      <Title>{product.title}</Title>

      <PriceInfo>
        <PriceRow>
          <span>Сред. розн. цена:</span>
          <Price bold>{product.retailPrice} ₸</Price>
        </PriceRow>
        <PriceRow>
          <span>Сред. опт. цена:</span>
          <Price>{product.wholesalePrice} ₸</Price>
        </PriceRow>
      </PriceInfo>

      <SupplierInfo>
        <span>Поставщиков</span>
        <Price bold> {product.suppliers}</Price>
      </SupplierInfo>

      <ButtonContainer onClick={handleButtonClick}>
        <OrderButton secondary>Оформить сейчас</OrderButton>
        <CartButton primary>В корзину</CartButton>
      </ButtonContainer>
    </Card>
  );
};

export default ProductCard;
