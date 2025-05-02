import React from "react";
import styled from "styled-components";
import Button from "./Button";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
`;

const RegistryLink = styled.a`
  font-size: 14px;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SupportLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;

  svg {
    margin-right: 8px;
  }
`;

const AddPriceButton = styled(Button)`
  background-color: #0066cc;
  color: white;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  position: relative;
  cursor: pointer;

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

const Header = ({ onCartClick }) => {
  return (
    <HeaderContainer>
      <RegistryLink href="#">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3C1 1.89543 1.89543 1 3 1Z"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 5H11M5 8H11M5 11H9"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Реестр всех компаний
      </RegistryLink>

      <RightSection>
        <SupportLink href="#">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 11V8M8 5H8.01"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Служба поддержки
        </SupportLink>

        <AddPriceButton primary>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1V15M1 8H15"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Добавить ценовое предложение
        </AddPriceButton>

        <CartButton onClick={onCartClick}>
          <svg
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
          </svg>
          <span>4</span>
        </CartButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
