import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const SidebarContainer = styled.div`
  background-color: white;
  height: 100vh;
  border-right: 1px solid #e0e0e0;
  padding-top: 20px;
`;
SidebarContainer.displayName = "SidebarContainer";

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 20px;

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
`;
Logo.displayName = "Logo";

const MenuItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    margin-right: 12px;
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
    right: 0;
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
  transition: background-color 0.2s;

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

  const handleItemClick = (itemName, path) => {
    setActiveItem(itemName);
    if (path) {
      navigate(path);
    }
  };

  return (
    <SidebarContainer>
      <Logo>
        <img
          src="https://avatars.mds.yandex.net/i?id=1d7b2be95336c95ecf78a007f7e85d4b_l-5232642-images-thumbs&n=13"
          alt="Лого"
        />
        <span>ИП Ибрагимова И. К.</span>
      </Logo>

      <MenuItem
        onClick={() => handleItemClick("Создать тендер", "/create-tender")}
        active={activeItem === "Создать тендер"}
      >
        <img src="/icons/Icon1.svg" width={"16"} height={"16"} alt="иконка" />
        Создать тендер
      </MenuItem>

      <MenuItem
        onClick={() => handleItemClick("Найти тендер", "/find-tender")}
        active={activeItem === "Найти тендер"}
      >
        <img src="/icons/Icon2.svg" width={"16"} height={"16"} alt="иконка" />
        Найти тендер
      </MenuItem>

      <MenuItem
        onClick={toggleSubMenu}
        expanded={isSubMenuOpen}
        active={["Создать тендер", "Найти тендер"].includes(activeItem)}
      >
        <img src="/icons/Icon3.svg" width={"16"} height={"16"} alt="иконка" />
        Закупки материалов
        <img src="/icons/shape.svg" alt="иконка" className="chevron" />
      </MenuItem>

      <SubMenu isOpen={isSubMenuOpen}>
        <SubMenuItem
          onClick={() => handleItemClick("Создать тендер (подменю)")}
          active={activeItem === "Создать тендер (подменю)"}
        >
          Создать тендер
        </SubMenuItem>
        <SubMenuItem
          onClick={() => handleItemClick("Найти тендер (подменю)")}
          active={activeItem === "Найти тендер (подменю)"}
        >
          Найти тендер
        </SubMenuItem>
      </SubMenu>

      <MenuItem
        onClick={() => handleItemClick("Мои тендеры")}
        active={activeItem === "Мои тендеры"}
      >
        <img src="/icons/Icon4.svg" width={"16"} height={"16"} alt="иконка" />
        Мои тендеры
      </MenuItem>

      <SubMenuItem
        onClick={() => handleItemClick("Закупки")}
        active={activeItem === "Закупки"}
      >
        Закупки
      </SubMenuItem>
      <SubMenuItem
        onClick={() => handleItemClick("Мои поставщики")}
        active={activeItem === "Мои поставщики"}
      >
        Мои поставщики
      </SubMenuItem>
      <SubMenuItem
        onClick={() => handleItemClick("Данные по тендерам")}
        active={activeItem === "Данные по тендерам"}
      >
        Данные по тендерам
      </SubMenuItem>
      <SubMenuItem
        onClick={() => handleItemClick("Реестр компаний")}
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
        onClick={() => handleItemClick("Избранные тендеры")}
        active={activeItem === "Избранные тендеры"}
      >
        <img src="/icons/Icon4.svg" width={"16"} height={"16"} alt="иконка" />
        Избранные тендеры
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
