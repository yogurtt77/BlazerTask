import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

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
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 40px;
  height: 40px;
  position: relative;
`;
MobileCartButton.displayName = "MobileCartButton";

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #0066cc;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
        <Sidebar />
      </StyledSidebar>

      <StyledMainContent>
        <MobileHeader>
          <MobileMenuButton onClick={toggleMobileMenu}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

          <MobileTitle>Прайс листы</MobileTitle>

          <MobileCartButton onClick={handleCartClick}>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <CartBadge>3</CartBadge>
          </MobileCartButton>
        </MobileHeader>

        <StyledDesktopHeader>
          <Header onCartClick={handleCartClick} />
        </StyledDesktopHeader>

        <Outlet />
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
