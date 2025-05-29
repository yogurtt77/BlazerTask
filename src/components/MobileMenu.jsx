import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  overflow-y: auto;
`;

const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const MenuTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  border-bottom: 1px solid #eee;
`;

const MenuLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #f0f7ff;
    color: #0066cc;
    font-weight: 500;
  `}
`;

const SubMenuContainer = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  background-color: #f9f9f9;
`;

const SubMenuItem = styled.li`
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SubMenuLink = styled.div`
  display: block;
  padding: 14px 16px 14px 32px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;

  ${(props) =>
    props.active &&
    `
    background-color: #e6f0ff;
    color: #0066cc;
    font-weight: 500;
    border-left: 3px solid #0066cc;
    padding-left: 29px;
  `}
`;

const MenuIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 12px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;

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

const MobileMenu = ({ isOpen, onClose }) => {
  const [openSubMenu, setOpenSubMenu] = useState(true);
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
    setOpenSubMenu(!openSubMenu);
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
      onClose(); // Закрываем мобильное меню после перехода
    }
  };

  return (
    <MenuContainer isOpen={isOpen}>
      <MenuHeader>
        <MenuTitle>Меню</MenuTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </MenuHeader>

      <Logo>
        <img
          src="https://avatars.mds.yandex.net/i?id=1d7b2be95336c95ecf78a007f7e85d4b_l-5232642-images-thumbs&n=13"
          alt="Лого"
        />
        <span>ИП Ибрагимова И. К.</span>
      </Logo>

      <MenuList>
        <MenuItem>
          <MenuLink
            active={activeItem === "Создать тендер"}
            onClick={() =>
              handleItemClick(
                "Создать тендер",
                "https://sadi.kz/PurchaseNew/CreateNewTender"
              )
            }
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <MenuIcon src="/icons/Icon1.svg" alt="иконка" />
              Создать тендер
            </div>
          </MenuLink>
        </MenuItem>

        <MenuItem>
          <MenuLink
            active={activeItem === "Найти тендер"}
            onClick={() =>
              handleItemClick(
                "Найти тендер",
                "https://sadi.kz/PurchaseNew/CreateNewTender"
              )
            }
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <MenuIcon src="/icons/Icon2.svg" alt="иконка" />
              Найти тендер
            </div>
          </MenuLink>
        </MenuItem>

        <MenuItem>
          <MenuLink
            active={["Создать тендер", "Найти тендер"].includes(activeItem)}
            onClick={toggleSubMenu}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <MenuIcon src="/icons/Icon3.svg" alt="иконка" />
              Закупки материалов
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: openSubMenu ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s ease",
              }}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MenuLink>

          <SubMenuContainer isOpen={openSubMenu}>
            <MenuList>
              <SubMenuItem>
                <SubMenuLink
                  active={activeItem === "Создать тендер (подменю)"}
                  onClick={() =>
                    handleItemClick(
                      "Создать тендер (подменю)",
                      "https://sadi.kz/PurchaseNew/CreateNewTender"
                    )
                  }
                >
                  Создать тендер
                </SubMenuLink>
              </SubMenuItem>
              <SubMenuItem>
                <SubMenuLink
                  active={activeItem === "Найти тендер (подменю)"}
                  onClick={() =>
                    handleItemClick(
                      "Найти тендер (подменю)",
                      "https://sadi.kz/PurchaseNew/CreateNewTender"
                    )
                  }
                >
                  Найти тендер
                </SubMenuLink>
              </SubMenuItem>
            </MenuList>
          </SubMenuContainer>
        </MenuItem>

        <MenuItem>
          <MenuLink
            active={activeItem === "Мои тендеры"}
            onClick={() => handleItemClick("Мои тендеры")}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <MenuIcon src="/icons/Icon4.svg" alt="иконка" />
              Мои тендеры
            </div>
          </MenuLink>
        </MenuItem>

        <MenuItem>
          <SubMenuLink
            active={activeItem === "Закупки"}
            onClick={() => handleItemClick("Закупки")}
          >
            Закупки
          </SubMenuLink>
        </MenuItem>

        <MenuItem>
          <SubMenuLink
            active={activeItem === "Мои поставщики"}
            onClick={() => handleItemClick("Мои поставщики")}
          >
            Мои поставщики
          </SubMenuLink>
        </MenuItem>

        <MenuItem>
          <SubMenuLink
            active={activeItem === "Данные по тендерам"}
            onClick={() => handleItemClick("Данные по тендерам")}
          >
            Данные по тендерам
          </SubMenuLink>
        </MenuItem>

        <MenuItem>
          <SubMenuLink
            active={activeItem === "Реестр компаний"}
            onClick={() => handleItemClick("Реестр компаний")}
          >
            Реестр компаний
          </SubMenuLink>
        </MenuItem>

        <MenuItem>
          <SubMenuLink
            active={activeItem === "Прайс листы"}
            onClick={() => handleItemClick("Прайс листы", "/")}
          >
            Прайс листы
          </SubMenuLink>
        </MenuItem>

        <MenuItem>
          <MenuLink
            active={activeItem === "Избранные тендеры"}
            onClick={() => handleItemClick("Избранные тендеры")}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <MenuIcon src="/icons/Icon4.svg" alt="иконка" />
              Избранные тендеры
            </div>
          </MenuLink>
        </MenuItem>
      </MenuList>
    </MenuContainer>
  );
};

MenuContainer.displayName = "MenuContainer";
MenuHeader.displayName = "MenuHeader";
CloseButton.displayName = "CloseButton";
MenuTitle.displayName = "MenuTitle";
MenuList.displayName = "MenuList";
MenuItem.displayName = "MenuItem";
MenuLink.displayName = "MenuLink";
SubMenuContainer.displayName = "SubMenuContainer";
SubMenuItem.displayName = "SubMenuItem";
SubMenuLink.displayName = "SubMenuLink";
MenuIcon.displayName = "MenuIcon";
Logo.displayName = "Logo";

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
