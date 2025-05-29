import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import { useCart } from "../context/CartContext";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;
LayoutContainer.displayName = "LayoutContainer";

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
MainContent.displayName = "MainContent";

const MobileHeader = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;

  @media (max-width: 768px) {
    display: flex;
  }
`;
MobileHeader.displayName = "MobileHeader";

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 40px;
  height: 40px;
`;
MobileMenuButton.displayName = "MobileMenuButton";

const MobileTitle = styled.h1`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;
MobileTitle.displayName = "MobileTitle";

const MobileCartButton = styled.button`
  background: none;
  border: 2px solid #d6dce1;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  width: 40px;
  height: 40px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0066cc;
    background-color: #f8f9fa;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;
MobileCartButton.displayName = "MobileCartButton";

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #0066cc;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;
CartBadge.displayName = "CartBadge";

// Модифицируем существующие стили для адаптивности
const StyledLayoutContainer = styled(LayoutContainer)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
StyledLayoutContainer.displayName = "StyledLayoutContainer";

const StyledSidebar = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
StyledSidebar.displayName = "StyledSidebar";

const StyledMainContent = styled(MainContent)`
  @media (max-width: 768px) {
    padding-top: 0;
  }
`;
StyledMainContent.displayName = "StyledMainContent";

const StyledDesktopHeader = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
StyledDesktopHeader.displayName = "StyledDesktopHeader";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <StyledLayoutContainer>
      <StyledSidebar>
        <aside>
          <Sidebar />
        </aside>
      </StyledSidebar>

      <StyledMainContent>
        <MobileHeader as="header" role="banner">
          <MobileMenuButton
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 12H21"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 18H21"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MobileMenuButton>

          <MobileTitle as="h1">Прайс листы</MobileTitle>

          <MobileCartButton
            onClick={handleCartClick}
            aria-label={`Корзина, ${getCartItemsCount()} товаров`}
          >
            <img
              src="/icons/mainbusket.svg"
              width="24"
              height="24"
              alt="Иконка корзины"
            />
            {getCartItemsCount() > 0 && (
              <CartBadge
                aria-label={`${getCartItemsCount()} товаров в корзине`}
              >
                {getCartItemsCount()}
              </CartBadge>
            )}
          </MobileCartButton>
        </MobileHeader>

        <StyledDesktopHeader as="header" role="banner">
          <Header onCartClick={handleCartClick} />
        </StyledDesktopHeader>

        <main>
          <Outlet />
        </main>
      </StyledMainContent>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </StyledLayoutContainer>
  );
};

Layout.displayName = "Layout";

export default Layout;
