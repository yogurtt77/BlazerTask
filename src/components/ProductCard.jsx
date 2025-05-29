import React from "react";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { useProductImage } from "../hooks/useProductImage";

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%; /* Занимает всю доступную высоту */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;
Card.displayName = "Card";

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px; /* Фиксированная высота */
  padding: 12px;
  background-color: ${(props) => (props.isLoading ? "#f5f5f5" : "transparent")};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: opacity 0.3s ease;
    opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  }
`;
ImageContainer.displayName = "ImageContainer";

const Title = styled.h3`
  font-size: 17px;
  font-weight: bold;
  color: #333;
  line-height: 150%;
  margin-top: 16px;
  height: 50px; /* Фиксированная высота */
  overflow: hidden; /* Скрывает текст, который не помещается */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Ограничивает текст двумя строками */
  -webkit-box-orient: vertical;
`;
Title.displayName = "Title";

const PriceInfo = styled.div`
  margin-top: 24px;
  flex: 0 0 auto; /* Не растягивается */
`;
PriceInfo.displayName = "PriceInfo";

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
  color: #808185;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;
PriceRow.displayName = "PriceRow";

const Price = styled.span`
  font-weight: ${(props) => (props.bold ? "600" : "400")};
`;
Price.displayName = "Price";

const ButtonContainer = styled.div`
  margin-top: auto; /* Прижимает кнопки к низу карточки */
  padding-top: 16px; /* Добавляет отступ сверху */
  display: flex;
  /* gap: 8px; */
  justify-content: space-between;
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;
ButtonContainer.displayName = "ButtonContainer";

const OrderButton = styled.button`
  padding: 6px 10px;
  background-color: white;
  font-weight: bold;
  color: #333;
  border: 2px solid #d6dce1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;
OrderButton.displayName = "OrderButton";

const CartButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  background-color: #0066cc;
  color: white;
  border: none;

  &:hover {
    background-color: #0055b3;
  }
`;
CartButton.displayName = "CartButton";

const ProductCard = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const { imageUrl, isLoading } = useProductImage(product.MaterialId);

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleAddToCart = (e) => {
    // Предотвращаем всплытие события клика, чтобы не срабатывал клик по карточке
    e.stopPropagation();

    // Создаем объект товара с правильными именами свойств для корзины
    const cartItem = {
      id: product.MaterialId,
      title: product.MaterialName,
      retailPrice: product.RetailPrice ? parseFloat(product.RetailPrice) : null,
      wholesalePrice: product.WholesalePrice
        ? parseFloat(product.WholesalePrice)
        : null,
      image: imageUrl,
    };

    addToCart(cartItem);
  };

  const handleOrderNow = (e) => {
    // Предотвращаем всплытие события клика
    e.stopPropagation();

    // Создаем объект товара с правильными именами свойств для корзины
    const cartItem = {
      id: product.MaterialId,
      title: product.MaterialName,
      retailPrice: product.RetailPrice ? parseFloat(product.RetailPrice) : null,
      wholesalePrice: product.WholesalePrice
        ? parseFloat(product.WholesalePrice)
        : null,
      image: imageUrl,
    };

    // Добавляем товар в корзину и можно перенаправить на страницу оформления заказа
    addToCart(cartItem);
    // Перенаправление на страницу корзины можно реализовать с помощью useNavigate из react-router-dom
    window.location.href = "/cart";
  };

  return (
    <Card as="article" onClick={handleCardClick}>
      <ImageContainer isLoading={isLoading}>
        <img
          src={imageUrl}
          alt={product.MaterialName}
          loading="lazy" // Ленивая загрузка изображений
          decoding="async" // Асинхронное декодирование изображений
          onError={(e) => {
            e.target.onerror = null; // Предотвращаем бесконечную рекурсию
            e.target.src = "/images/placeholder.png"; // Заглушка при ошибке
          }}
        />
      </ImageContainer>

      <Title as="h2">{product.MaterialName}</Title>

      <PriceInfo>
        <PriceRow>
          <span>Сред. розн. цена:</span>
          <Price bold>{product.RetailPrice || "По запросу"} ₸</Price>
        </PriceRow>
        <PriceRow>
          <span>Сред. опт. цена:</span>
          <Price>{product.WholesalePrice || "По запросу"} ₸</Price>
        </PriceRow>
        <PriceRow>
          <span>Поставщиков</span>
          <Price bold> {product.SuppliersCount || 0}</Price>
        </PriceRow>
      </PriceInfo>

      <ButtonContainer>
        <OrderButton
          onClick={handleOrderNow}
          aria-label={`Оформить заказ на ${product.MaterialName}`}
        >
          Оформить сейчас
        </OrderButton>
        <CartButton
          onClick={handleAddToCart}
          aria-label={`Добавить ${product.MaterialName} в корзину`}
        >
          В корзину
        </CartButton>
      </ButtonContainer>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";

export default ProductCard;
