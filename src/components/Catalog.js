import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const CatalogContainer = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CatalogButton = styled.button`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const CatalogDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 900px;

  @media (max-width: 1024px) {
    width: 700px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    flex-direction: column;
  }
`;

const PrimaryCategoriesContainer = styled.div`
  width: 40%;
  border-right: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    max-height: 50%;
    overflow-y: auto;
  }
`;

const PrimaryCategory = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  position: relative;

  &:hover {
    background-color: #f5f5f5;
  }

  ${(props) =>
    props.active &&
    `
    background-color: #f5f5f5;
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 3px;
      background-color: #0066cc;
    }
  `}
`;

const SecondaryCategoriesContainer = styled.div`
  width: 60%;
  padding: 12px 0;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 50%;
    overflow-y: auto;
  }
`;

const SecondaryCategory = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
    color: #0066cc;
  }
`;

const CategoryHeader = styled.div`
  padding: 12px 16px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Catalog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const catalogRef = useRef(null);

  // Данные для каталога
  const categories = [
    {
      id: 1,
      name: "МАТЕРИАЛЫ И КОНСТРУКЦИИ ДЛЯ ОБЩЕСТРОИТЕЛЬНЫХ РАБОТ",
      subcategories: [
        "Бетоны, растворы, готовые к употреблению",
        "Металлопрокат",
        "Металлические конструкции и изделия",
        "Лесоматериалы, деревянные изделия и конструкции",
        "Конструкции и материалы",
        "Изделия и конструкции для заполнения проемов",
        "Кровельные материалы и конструкции, гидроизоляционные материалы",
        "Теплоизоляционные материалы",
        "Огнеупорные материалы и изделия",
        "Материалы общего назначения",
      ],
    },
    {
      id: 2,
      name: "МЕТАЛЛОПРОКАТ ЛИСТОВОЙ",
      subcategories: [
        "Прокат листовой холоднокатный",
        "Прокат листовой нержавеющий и жаростойкий",
        "Сталь листовая оцинкованная",
        "Прокат листовой широкополосный",
        "Сталь полосовая",
        "Лента стальная",
        "Профилированный лист оцинкованный",
        "Профилированный лист оцинкованный с защитным покрытием",
        "Лист рифленный",
        "Лист просечно-вытяжной",
        "Листы из других металлов",
      ],
    },
    {
      id: 3,
      name: "МАТЕРИАЛЫ И КОНСТРУКЦИИ ДЛЯ ОТДЕЛОЧНОГО ЦИКЛА РАБОТ",
      subcategories: [
        "Отделочные материалы",
        "Лакокрасочные материалы",
        "Обои и стеновые покрытия",
        "Напольные покрытия",
        "Потолочные системы",
        "Керамическая плитка и керамогранит",
        "Сантехнические изделия и оборудование",
      ],
    },
    {
      id: 4,
      name: "ИНЖЕНЕРНЫЕ СИСТЕМЫ И ОБОРУДОВАНИЕ",
      subcategories: [
        "Системы отопления",
        "Системы вентиляции и кондиционирования",
        "Системы водоснабжения и канализации",
        "Электротехническое оборудование",
        "Системы автоматизации и контроля",
        "Противопожарные системы",
      ],
    },
    {
      id: 5,
      name: "СТРОИТЕЛЬНАЯ ТЕХНИКА И ОБОРУДОВАНИЕ",
      subcategories: [
        "Землеройная техника",
        "Подъемно-транспортное оборудование",
        "Бетоносмесительное оборудование",
        "Дорожно-строительная техника",
        "Строительные инструменты",
        "Строительные леса и опалубка",
      ],
    },
  ];

  // Устанавливаем первую категорию как активную по умолчанию
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories]);

  // Закрываем каталог при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCatalog = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const getActiveCategory = () => {
    return categories.find((category) => category.id === activeCategory);
  };

  return (
    <CatalogContainer ref={catalogRef}>
      <CatalogButton onClick={toggleCatalog}>
        Каталог
        <svg
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
      </CatalogButton>

      <CatalogDropdown isOpen={isOpen}>
        <PrimaryCategoriesContainer>
          <CategoryHeader>
            Каталог
            <CloseButton onClick={() => setIsOpen(false)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </CloseButton>
          </CategoryHeader>

          {categories.map((category) => (
            <PrimaryCategory
              key={category.id}
              active={category.id === activeCategory}
              onMouseEnter={() => handleCategoryHover(category.id)}
            >
              {category.name}
            </PrimaryCategory>
          ))}
        </PrimaryCategoriesContainer>

        <SecondaryCategoriesContainer>
          {getActiveCategory() &&
            getActiveCategory().subcategories.map((subcategory, index) => (
              <SecondaryCategory key={index}>{subcategory}</SecondaryCategory>
            ))}
        </SecondaryCategoriesContainer>
      </CatalogDropdown>
    </CatalogContainer>
  );
};

export default Catalog;
