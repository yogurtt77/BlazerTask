import React, { useState } from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 180px;
  background-color: white;
  height: 100vh;
  border-right: 1px solid #e0e0e0;
  padding-top: 20px;
`;

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

  ${(props) =>
    props.active &&
    `
    background-color: #f0f7ff;
    color: #0066cc;
    font-weight: 500;
    border-left: 3px solid #0066cc;
  `}

  ${(props) =>
    props.expanded &&
    `
    background-color: #f0f7ff;
  `}

  svg {
    margin-right: 10px;
  }

  .chevron {
    position: absolute;
    right: 16px;
    transition: transform 0.3s ease;
    ${(props) => props.expanded && `transform: rotate(180deg);`}
  }
`;

const SubMenu = styled.div`
  margin-left: 0;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: #f8f9fa;
`;

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

const ActiveIndicator = styled.div`
  width: 3px;
  background-color: #0066cc;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: ${(props) => (props.active ? "block" : "none")};
`;

const Sidebar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Прайс листы");

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <SidebarContainer>
      <Logo>
        <img src="https://via.placeholder.com/32" alt="Лого" />
        <span>ИП Ибрагимова И. К.</span>
      </Logo>

      <MenuItem
        onClick={() => handleItemClick("Создать тендер")}
        active={activeItem === "Создать тендер"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1L1 5V15H15V5L8 1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Создать тендер
      </MenuItem>

      <MenuItem
        onClick={() => handleItemClick("Найти тендер")}
        active={activeItem === "Найти тендер"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 5L8 10L2 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Найти тендер
      </MenuItem>

      <MenuItem
        onClick={toggleSubMenu}
        expanded={isSubMenuOpen}
        active={[
          "Закупки",
          "Мои поставщики",
          "Данные по тендерам",
          "Реестр компаний",
          "Прайс листы",
          "Создать тендер",
          "Найти тендер",
        ].includes(activeItem)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 8H15M8 1V15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Закупки материалов
        <svg
          className="chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MenuItem>

      <SubMenu isOpen={isSubMenuOpen}>
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
          onClick={() => handleItemClick("Прайс листы")}
          active={activeItem === "Прайс листы"}
        >
          Прайс листы
        </SubMenuItem>
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4H15M4 8H12M6 12H10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Мои тендеры
      </MenuItem>

      <MenuItem
        onClick={() => handleItemClick("Избранные тендеры")}
        active={activeItem === "Избранные тендеры"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 4V8L10 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Избранные тендеры
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
