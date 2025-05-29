import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const SidebarContainer = styled.div`
  background-color: white;
  height: 100vh;
  border-right: 1px solid #e0e0e0;
  padding-top: 20px;
  width: ${(props) => (props.collapsed ? "0" : "230px")};
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
  opacity: ${(props) => (props.collapsed ? "0" : "1")};
  transform: translateX(${(props) => (props.collapsed ? "-100%" : "0")});
`;
SidebarContainer.displayName = "SidebarContainer";

const CollapseButton = styled.button`
  position: fixed;
  top: 73px;
  left: ${(props) => (props.collapsed ? "10px" : "240px")};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.collapsed ? "rotate(180deg)" : "rotate(0)")};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 20px;
  white-space: nowrap;
  cursor: pointer;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;
Logo.displayName = "Logo";

const MenuItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    margin-right: 12px;
    flex-shrink: 0;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #f0f7ff;
    color: #0066cc;
    font-weight: 500;
    border-right: 3px solid #0066cc;
  `}

  ${(props) =>
    props.expanded &&
    `
    background-color: #f0f7ff;
  `}

  .chevron {
    position: absolute;
    right: 16px;
    transition: transform 0.3s ease;
    ${(props) => props.expanded && `transform: rotate(180deg);`}
  }
`;
MenuItem.displayName = "MenuItem";

const SubMenu = styled.div`
  margin-left: 0;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: #f8f9fa;
`;
SubMenu.displayName = "SubMenu";

const SubMenuItem = styled.div`
  padding: 12px 16px 12px 42px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #f0f0f0;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #e6f0ff;
    color: #0066cc;
    font-weight: 500;
    border-left: 3px solid #0066cc;
    padding-left: 39px;
  `}
`;
SubMenuItem.displayName = "SubMenuItem";

const ActiveIndicator = styled.div`
  width: 3px;
  background-color: #0066cc;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: ${(props) => (props.active ? "block" : "none")};
`;
ActiveIndicator.displayName = "ActiveIndicator";

const Sidebar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Прайс листы");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Обновляем активный элемент на основе текущего пути
  useEffect(() => {
    if (location.pathname === "/cart") {
      setActiveItem("Корзина");
    } else if (
      location.pathname === "/" ||
      location.pathname === "/price-list"
    ) {
      setActiveItem("Прайс листы");
    }
  }, [location.pathname]);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Если сворачиваем, то закрываем подменю
    if (!isCollapsed) {
      setIsSubMenuOpen(false);
    }
  };

  const handleItemClick = (itemName, path) => {
    setActiveItem(itemName);
    if (path) {
      if (path.startsWith("http")) {
        // Если это внешняя ссылка, открываем в новой вкладке
        window.open(path, "_blank");
      } else {
        // Если это внутренняя ссылка, используем navigate
        navigate(path);
      }
    }
  };

  return (
    <>
      <CollapseButton collapsed={isCollapsed} onClick={toggleCollapse}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapseButton>

      <SidebarContainer collapsed={isCollapsed}>
        <Logo
          collapsed={isCollapsed}
          onClick={() =>
            handleItemClick(
              "Кабинет",
              "https://sadi.kz/Cabinet/PersonalCabinetNew"
            )
          }
        >
          <img src="/images/null.jpg" alt="Лого" />
          {/* <span>Авторизация</span> */}
          Авторизация
        </Logo>

        <MenuItem
          onClick={() =>
            handleItemClick(
              "Создать тендер",
              "https://sadi.kz/PurchaseNew/CreateNewTender"
            )
          }
          active={activeItem === "Создать тендер"}
        >
          <img src="/icons/Icon1.svg" width={"16"} height={"16"} alt="иконка" />
          <span>Создать тендер</span>
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleItemClick(
              "Найти тендер",
              "https://sadi.kz/PurchaseNew/Search"
            )
          }
          active={activeItem === "Найти тендер"}
        >
          <img src="/icons/Icon2.svg" width={"16"} height={"16"} alt="иконка" />
          <span>Найти тендер</span>
        </MenuItem>

        <MenuItem
          onClick={toggleSubMenu}
          expanded={isSubMenuOpen}
          active={["Создать тендер", "Найти тендер"].includes(activeItem)}
        >
          <img src="/icons/Icon3.svg" width={"16"} height={"16"} alt="иконка" />
          <span>Закупки материалов</span>
          <img src="/icons/shape.svg" alt="иконка" className="chevron" />
        </MenuItem>

        <SubMenu isOpen={isSubMenuOpen}>
          <SubMenuItem
            onClick={() =>
              handleItemClick(
                "Создать тендер (подменю)",
                "https://sadi.kz/Purchase/Purchase"
              )
            }
            active={activeItem === "Создать тендер (подменю)"}
          >
            Создать тендер
          </SubMenuItem>
          <SubMenuItem
            onClick={() =>
              handleItemClick(
                "Найти тендер (подменю)",
                "https://sadi.kz/Tender/TenderView"
              )
            }
            active={activeItem === "Найти тендер (подменю)"}
          >
            Найти тендер
          </SubMenuItem>
        </SubMenu>

        <MenuItem
          onClick={() => handleItemClick("Сметный расчет")}
          active={activeItem === "Сметный расчет"}
        >
          <img src="/icons/Icon4.svg" width={"16"} height={"16"} alt="иконка" />
          <span>Сметный расчет</span>
        </MenuItem>

        <SubMenuItem
          onClick={() =>
            handleItemClick("Расценки", "https://sadi.kz/CostRates")
          }
          active={activeItem === "Расценки"}
        >
          Расценки
        </SubMenuItem>
        <SubMenuItem
          onClick={() => handleItemClick("Мои поставщики")}
          active={activeItem === "Мои поставщики"}
        >
          Мои поставщики
        </SubMenuItem>
        <SubMenuItem
          onClick={() =>
            handleItemClick("Смета", "https://sadi.kz/LocalQuotes")
          }
          active={activeItem === "Смета"}
        >
          Смета
        </SubMenuItem>
        <SubMenuItem
          onClick={() =>
            handleItemClick(
              "Реестр компаний",
              "https://sadi.kz/Provider/Provider"
            )
          }
          active={activeItem === "Реестр компаний"}
        >
          Реестр компаний
        </SubMenuItem>
        <SubMenuItem
          onClick={() => handleItemClick("Прайс листы", "/")}
          active={activeItem === "Прайс листы"}
        >
          Прайс листы
        </SubMenuItem>

        <MenuItem
          onClick={() =>
            handleItemClick(
              "Избранные тендеры",
              "https://sadi.kz/Supplier/TenderView"
            )
          }
          active={activeItem === "Избранные тендеры"}
        >
          <img src="/icons/Icon4.svg" width={"16"} height={"16"} alt="иконка" />
          <span>Избранные тендеры</span>
        </MenuItem>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
