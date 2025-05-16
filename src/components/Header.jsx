import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
`;
HeaderContainer.displayName = "HeaderContainer";

const RegistryLink = styled(Link)`
  font-size: 17px;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;

  img {
    margin-right: 8px;
  }
`;
RegistryLink.displayName = "RegistryLink";

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
RightSection.displayName = "RightSection";

const SupportLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  border-radius: 8px;
  padding: 6px 12px;
  border: 2px solid #d6dce1;

  img {
    margin-right: 8px;
  }
`;
SupportLink.displayName = "SupportLink";

const AddPriceButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: #0066cc;
  color: white;
  display: flex;
  align-items: center;
  font-weight: bold;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0055b3;
  }

  img {
    margin-right: 8px;
  }
`;
AddPriceButton.displayName = "AddPriceButton";

const CartButton = styled.button`
  background: none;
  border: none;
  position: relative;
  cursor: pointer;
  border: 2px solid #d6dce1;
  border-radius: 8px;
  padding: 2px 2px 0;

  svg {
    width: 24px;
    height: 24px;
  }

  span {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #0066cc;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
CartButton.displayName = "CartButton";

const Header = () => {
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <HeaderContainer as="nav">
      <RegistryLink to="/">
        <img
          src="/icons/busket.svg"
          width={"18"}
          height={"18"}
          alt="Иконка реестра"
        />
        Реестр всех компаний
      </RegistryLink>

      <RightSection>
        <SupportLink href="#" aria-label="Связаться со службой поддержки">
          <img
            src="/icons/Vector.svg "
            width={"10"}
            height={"10"}
            alt="Иконка поддержки"
          />
          Служба поддержки
        </SupportLink>

        <AddPriceButton primary aria-label="Добавить ценовое предложение">
          <img
            src="/icons/plus.svg"
            width={"18"}
            height={"18"}
            alt="Иконка плюс"
          />
          Добавить ценовое предложение
        </AddPriceButton>

        <CartButton
          onClick={handleCartClick}
          aria-label={`Корзина, ${getCartItemsCount()} товаров`}
        >
          <img
            src="/icons/mainbusket.svg"
            width={"26"}
            height={"26"}
            alt="Иконка корзины"
          />
          {getCartItemsCount() > 0 && (
            <span aria-hidden="true">{getCartItemsCount()}</span>
          )}
        </CartButton>
      </RightSection>
    </HeaderContainer>
  );
};

Header.displayName = "Header";

export default Header;
