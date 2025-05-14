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
    <HeaderContainer>
      <RegistryLink to="/">
        <img src="/icons/busket.svg" width={"18"} height={"18"} alt="иконка" />
        Реестр всех компаний
      </RegistryLink>

      <RightSection>
        <SupportLink href="#">
          <img
            src="/icons/Vector.svg "
            width={"10"}
            height={"10"}
            alt="иконка"
          />
          Служба поддержки
        </SupportLink>

        <AddPriceButton primary>
          <img src="/icons/plus.svg" width={"18"} height={"18"} alt="иконка" />
          Добавить ценовое предложение
        </AddPriceButton>

        <CartButton onClick={handleCartClick}>
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          <img
            src="/icons/mainbusket.svg"
            width={"26"}
            height={"26"}
            alt="иконка"
          />
          {getCartItemsCount() > 0 && <span>{getCartItemsCount()}</span>}
        </CartButton>
      </RightSection>
    </HeaderContainer>
  );
};

Header.displayName = "Header";

export default Header;
