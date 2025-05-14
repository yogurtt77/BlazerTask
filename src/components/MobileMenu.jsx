import React, { useState } from "react";
import styled from "styled-components";

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

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  color: #333;
  text-decoration: none;
  font-size: 16px;

  svg {
    width: 16px;
    height: 16px;
  }
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

const SubMenuLink = styled.a`
  display: block;
  padding: 14px 16px 14px 32px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
`;

const MobileMenu = ({ isOpen, onClose }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSubMenu = (id) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  const menuItems = [
    {
      id: 1,
      title: "Закупки материалов",
      subItems: [
        { id: 11, title: "Найти тендер" },
        { id: 12, title: "Создать тендер" },
        { id: 13, title: "Мои тендеры" },
      ],
    },
    {
      id: 2,
      title: "Каталог",
      subItems: [
        { id: 21, title: "Материалы и конструкции для общестроительных работ" },
        { id: 22, title: "Металлопрокат листовой" },
        {
          id: 23,
          title: "Материалы и конструкции для отделочного цикла работ",
        },
      ],
    },
    {
      id: 3,
      title: "Мои тендеры",
      subItems: [],
    },
    {
      id: 4,
      title: "Мои поставщики",
      subItems: [],
    },
    {
      id: 5,
      title: "Данные по тендерам",
      subItems: [],
    },
    {
      id: 6,
      title: "Реестр компаний",
      subItems: [],
    },
    {
      id: 7,
      title: "Прайс листы",
      subItems: [],
    },
  ];

  return (
    <MenuContainer isOpen={isOpen}>
      <MenuHeader>
        <MenuTitle>Меню</MenuTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </MenuHeader>

      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.id}>
            <MenuLink
              href="#"
              onClick={(e) => {
                if (item.subItems.length > 0) {
                  e.preventDefault();
                  toggleSubMenu(item.id);
                }
              }}
            >
              {item.title}
              {item.subItems.length > 0 && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={
                      openSubMenu === item.id
                        ? "M12 10L8 6L4 10"
                        : "M4 6L8 10L12 6"
                    }
                    stroke="#333"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </MenuLink>

            {item.subItems.length > 0 && (
              <SubMenuContainer isOpen={openSubMenu === item.id}>
                <MenuList>
                  {item.subItems.map((subItem) => (
                    <SubMenuItem key={subItem.id}>
                      <SubMenuLink href="#">{subItem.title}</SubMenuLink>
                    </SubMenuItem>
                  ))}
                </MenuList>
              </SubMenuContainer>
            )}
          </MenuItem>
        ))}
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

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
