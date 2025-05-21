import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useCatalog } from "../hooks/useApi";

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
  border: 1px solid #d5d5d6;
  border-radius: 8px;
  padding: 16px;
  gap: 160px;
  font-size: 17px;
  cursor: pointer;

  svg,
  img {
    margin-left: 8px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
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
  z-index: 101;

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
    overflow: hidden;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  height: 500px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

const DepartmentsContainer = styled.div`
  width: 25%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: calc(100% - 54px); /* Вычитаем высоту заголовка */
    border-right: none;
    display: ${(props) => (props.mobileLevel === 0 ? "block" : "none")};
    overflow-y: auto;
    background-color: white;
  }
`;

const SectionsContainer = styled.div`
  width: 25%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: calc(100% - 54px); /* Вычитаем высоту заголовка */
    border-right: none;
    display: ${(props) => (props.mobileLevel === 1 ? "block" : "none")};
    overflow-y: auto;
    background-color: white;
  }
`;

const SubsectionsContainer = styled.div`
  width: 25%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: calc(100% - 54px); /* Вычитаем высоту заголовка */
    border-right: none;
    display: ${(props) => (props.mobileLevel === 2 ? "block" : "none")};
    overflow-y: auto;
    background-color: white;
  }
`;

const GroupsContainer = styled.div`
  width: 25%;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: calc(100% - 54px); /* Вычитаем высоту заголовка */
    display: ${(props) => (props.mobileLevel === 3 ? "block" : "none")};
    overflow-y: auto;
    background-color: white;
  }
`;

const CategoryItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

  @media (max-width: 768px) {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px;
    font-size: 14px;
    background-color: white;
  }
`;

const CategoryItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryArrow = styled.div`
  @media (max-width: 768px) {
    display: block;
    margin-left: 8px;
  }
  display: none;
`;

const CategoryCode = styled.span`
  color: #666;
  font-size: 12px;
  margin-right: 6px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 14px;
  color: #666;
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 2px solid #009639;
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 101;
    width: 100%;

    /* Фиксированная ширина для кнопок, чтобы заголовок был по центру */
    & > button:first-child,
    & > button:last-child {
      width: 40px;
    }

    & > button:first-child {
      text-align: left;
    }

    & > button:last-child {
      text-align: right;
    }
  }
`;

const MobileBackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  padding: 0;
  white-space: nowrap;
  justify-content: flex-start;

  img {
    width: 16px;
    height: 16px;
  }
`;

const MobileTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  flex-grow: 1;
  text-align: center;
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 0;

  img {
    width: 16px;
    height: 16px;
  }
`;

const Catalog = ({ onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSubsection, setActiveSubsection] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  // Состояние для мобильной навигации
  const [mobileLevel, setMobileLevel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const catalogRef = useRef(null);

  // Используем React Query для получения данных каталога
  const {
    data: rawCatalogData = [],
    isLoading,
    error,
  } = useCatalog({
    // Включаем запрос только когда каталог открыт
    enabled: isOpen,
  });

  // Преобразуем данные каталога в нужный формат
  const catalogData = React.useMemo(() => {
    if (!rawCatalogData || rawCatalogData.length === 0) return null;

    const transformedData = {};

    // Сначала найдем все отделы (элементы верхнего уровня, у которых ParId = 1)
    const departments = rawCatalogData.filter((item) => item.ParId === 1);

    // Создаем структуру отделов
    departments.forEach((dept) => {
      const id = dept.MaterialTreeId.toString();
      transformedData[id] = {
        name: dept.MaterialTreeName,
        sections: {},
      };

      // Находим разделы для этого отдела
      const sections = rawCatalogData.filter(
        (item) => item.ParId === dept.MaterialTreeId
      );

      // Добавляем разделы
      sections.forEach((section) => {
        const sectionId = section.MaterialTreeId.toString();
        transformedData[id].sections[sectionId] = {
          name: section.MaterialTreeName,
          subsections: {},
        };

        // Находим подразделы для этого раздела
        const subsections = rawCatalogData.filter(
          (item) => item.ParId === section.MaterialTreeId
        );

        // Добавляем подразделы
        subsections.forEach((subsection) => {
          const subsectionId = subsection.MaterialTreeId.toString();
          transformedData[id].sections[sectionId].subsections[subsectionId] = {
            name: subsection.MaterialTreeName,
            groups: {},
          };

          // Находим группы для этого подраздела
          const groups = rawCatalogData.filter(
            (item) => item.ParId === subsection.MaterialTreeId
          );

          // Добавляем группы
          groups.forEach((group) => {
            const groupId = group.MaterialTreeId.toString();
            transformedData[id].sections[sectionId].subsections[
              subsectionId
            ].groups[groupId] = group.MaterialTreeName;
          });
        });
      });
    });

    return transformedData;
  }, [rawCatalogData]);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Закрываем каталог при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setIsOpen(false);
        // Сбрасываем уровень мобильной навигации при закрытии
        setMobileLevel(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCatalog = () => {
    if (!isOpen) {
      // При открытии каталога сбрасываем уровень мобильной навигации
      setMobileLevel(0);
    }
    setIsOpen(!isOpen);
  };

  const handleDepartmentClick = (departmentId) => {
    setActiveDepartment(departmentId);
    setActiveGroup(null);

    // Сбрасываем активные разделы и подразделы
    if (
      catalogData &&
      catalogData[departmentId] &&
      catalogData[departmentId].sections
    ) {
      const firstSectionId = Object.keys(catalogData[departmentId].sections)[0];
      setActiveSection(firstSectionId);

      if (
        catalogData[departmentId].sections[firstSectionId] &&
        catalogData[departmentId].sections[firstSectionId].subsections
      ) {
        const firstSubsectionId = Object.keys(
          catalogData[departmentId].sections[firstSectionId].subsections
        )[0];
        setActiveSubsection(firstSubsectionId);
      } else {
        setActiveSubsection(null);
      }
    } else {
      setActiveSection(null);
      setActiveSubsection(null);
    }

    // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом
    if (onCategorySelect) {
      onCategorySelect({
        department: departmentId,
        section: null,
        subsection: null,
        group: null,
      });
    }

    // Для мобильной версии переходим на следующий уровень
    if (isMobile) {
      setMobileLevel(1);
    }
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setActiveGroup(null);

    // Сбрасываем активный подраздел
    if (
      catalogData &&
      catalogData[activeDepartment] &&
      catalogData[activeDepartment].sections[sectionId] &&
      catalogData[activeDepartment].sections[sectionId].subsections
    ) {
      const firstSubsectionId = Object.keys(
        catalogData[activeDepartment].sections[sectionId].subsections
      )[0];
      setActiveSubsection(firstSubsectionId);
    } else {
      setActiveSubsection(null);
    }

    // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом и разделом
    if (onCategorySelect) {
      onCategorySelect({
        department: activeDepartment,
        section: sectionId,
        subsection: null,
        group: null,
      });
    }

    // Для мобильной версии переходим на следующий уровень
    if (isMobile) {
      setMobileLevel(2);
    }
  };

  const handleSubsectionClick = (subsectionId) => {
    setActiveSubsection(subsectionId);
    setActiveGroup(null);

    // Получаем первую группу для этого подраздела, если она есть
    if (
      catalogData &&
      catalogData[activeDepartment] &&
      catalogData[activeDepartment].sections[activeSection] &&
      catalogData[activeDepartment].sections[activeSection].subsections[
        subsectionId
      ] &&
      catalogData[activeDepartment].sections[activeSection].subsections[
        subsectionId
      ].groups
    ) {
      const groups =
        catalogData[activeDepartment].sections[activeSection].subsections[
          subsectionId
        ].groups;
      if (Object.keys(groups).length > 0) {
        const firstGroupId = Object.keys(groups)[0];
        setActiveGroup(firstGroupId);
      }
    }

    // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом, разделом и подразделом
    if (onCategorySelect) {
      onCategorySelect({
        department: activeDepartment,
        section: activeSection,
        subsection: subsectionId,
        group: null,
      });
    }

    // Для мобильной версии переходим на следующий уровень
    if (isMobile) {
      setMobileLevel(3);
    }
  };

  const handleGroupClick = (groupId) => {
    setActiveGroup(groupId);

    // Вызываем функцию фильтрации с полной иерархией до группы
    if (onCategorySelect) {
      onCategorySelect({
        department: activeDepartment,
        section: activeSection,
        subsection: activeSubsection,
        group: groupId,
      });
    }

    // Для мобильной версии закрываем каталог после выбора группы
    if (isMobile) {
      setIsOpen(false);
      setMobileLevel(0);
    }
  };

  // Обработчик кнопки "Назад" для мобильной версии
  const handleMobileBack = () => {
    if (mobileLevel > 0) {
      setMobileLevel(mobileLevel - 1);
    } else {
      // При нажатии на крестик закрываем каталог полностью
      setIsOpen(false);
      setMobileLevel(0);
    }
  };

  // Получаем активные разделы
  const getActiveSections = () => {
    if (!catalogData || !activeDepartment || !catalogData[activeDepartment]) {
      return {};
    }
    return catalogData[activeDepartment].sections || {};
  };

  // Получаем активные подразделы
  const getActiveSubsections = () => {
    if (
      !catalogData ||
      !activeDepartment ||
      !activeSection ||
      !catalogData[activeDepartment] ||
      !catalogData[activeDepartment].sections ||
      !catalogData[activeDepartment].sections[activeSection]
    ) {
      return {};
    }
    return (
      catalogData[activeDepartment].sections[activeSection].subsections || {}
    );
  };

  // Получаем активные группы
  const getActiveGroups = () => {
    if (
      !catalogData ||
      !activeDepartment ||
      !activeSection ||
      !activeSubsection ||
      !catalogData[activeDepartment] ||
      !catalogData[activeDepartment].sections ||
      !catalogData[activeDepartment].sections[activeSection] ||
      !catalogData[activeDepartment].sections[activeSection].subsections ||
      !catalogData[activeDepartment].sections[activeSection].subsections[
        activeSubsection
      ]
    ) {
      return {};
    }
    return (
      catalogData[activeDepartment].sections[activeSection].subsections[
        activeSubsection
      ].groups || {}
    );
  };

  // Получаем заголовок для текущего уровня мобильной навигации
  const getMobileTitle = () => {
    if (mobileLevel === 0) {
      return "Каталог";
    } else if (
      mobileLevel === 1 &&
      activeDepartment &&
      catalogData &&
      catalogData[activeDepartment]
    ) {
      return catalogData[activeDepartment].name;
    } else if (
      mobileLevel === 2 &&
      activeSection &&
      getActiveSections()[activeSection]
    ) {
      return getActiveSections()[activeSection].name;
    } else if (
      mobileLevel === 3 &&
      activeSubsection &&
      getActiveSubsections()[activeSubsection]
    ) {
      return getActiveSubsections()[activeSubsection].name;
    }
    return "Каталог";
  };

  return (
    <CatalogContainer ref={catalogRef}>
      <CatalogButton onClick={toggleCatalog} isOpen={isOpen}>
        Каталог
        <img src="/icons/icon4.svg" alt="" />
      </CatalogButton>

      <CatalogDropdown isOpen={isOpen}>
        {isLoading ? (
          <LoadingIndicator>Загрузка каталога...</LoadingIndicator>
        ) : error ? (
          <LoadingIndicator>
            Ошибка: {error.message || "Произошла ошибка"}
          </LoadingIndicator>
        ) : (
          <>
            {/* Мобильный заголовок */}
            <MobileHeader>
              <MobileBackButton onClick={handleMobileBack}>
                {mobileLevel > 0 ? "< Назад" : null}
              </MobileBackButton>
              <MobileTitle>{getMobileTitle()}</MobileTitle>
              <MobileCloseButton
                onClick={() => {
                  setIsOpen(false);
                  setMobileLevel(0);
                }}
              >
                <img src="/icons/icon4.svg" alt="Закрыть" />
              </MobileCloseButton>
            </MobileHeader>

            <CategoryContainer>
              {/* Отделы */}
              <DepartmentsContainer mobileLevel={mobileLevel}>
                {catalogData &&
                  Object.entries(catalogData).map(
                    ([departmentId, department]) => (
                      <CategoryItem
                        key={departmentId}
                        active={departmentId === activeDepartment}
                        onClick={() => handleDepartmentClick(departmentId)}
                      >
                        <CategoryItemContent>
                          <CategoryCode>{departmentId}</CategoryCode>
                          {department.name}
                        </CategoryItemContent>
                        <CategoryArrow>
                          <img src="/icons/arrow-right.svg" alt="" />
                        </CategoryArrow>
                      </CategoryItem>
                    )
                  )}
              </DepartmentsContainer>

              {/* Разделы */}
              <SectionsContainer mobileLevel={mobileLevel}>
                {Object.entries(getActiveSections()).map(
                  ([sectionId, section]) => (
                    <CategoryItem
                      key={sectionId}
                      active={sectionId === activeSection}
                      onClick={() => handleSectionClick(sectionId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode>{sectionId}</CategoryCode>
                        {section.name}
                      </CategoryItemContent>
                      <CategoryArrow>
                        <img src="/icons/arrow-right.svg" alt="" />
                      </CategoryArrow>
                    </CategoryItem>
                  )
                )}
              </SectionsContainer>

              {/* Подразделы */}
              <SubsectionsContainer mobileLevel={mobileLevel}>
                {Object.entries(getActiveSubsections()).map(
                  ([subsectionId, subsection]) => (
                    <CategoryItem
                      key={subsectionId}
                      active={subsectionId === activeSubsection}
                      onClick={() => handleSubsectionClick(subsectionId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode>{subsectionId}</CategoryCode>
                        {subsection.name}
                      </CategoryItemContent>
                      <CategoryArrow>
                        <img src="/icons/arrow-right.svg" alt="" />
                      </CategoryArrow>
                    </CategoryItem>
                  )
                )}
              </SubsectionsContainer>

              {/* Группы */}
              <GroupsContainer mobileLevel={mobileLevel}>
                {Object.entries(getActiveGroups()).map(
                  ([groupId, groupName]) => (
                    <CategoryItem
                      key={groupId}
                      active={groupId === activeGroup}
                      onClick={() => handleGroupClick(groupId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode>{groupId}</CategoryCode>
                        {groupName}
                      </CategoryItemContent>
                    </CategoryItem>
                  )
                )}
              </GroupsContainer>
            </CategoryContainer>
          </>
        )}
      </CatalogDropdown>
    </CatalogContainer>
  );
};

// Добавляем displayName для всех стилизованных компонентов
CatalogContainer.displayName = "CatalogContainer";
CatalogButton.displayName = "CatalogButton";
CloseButton.displayName = "CloseButton";
CatalogDropdown.displayName = "CatalogDropdown";
CategoryContainer.displayName = "CategoryContainer";
DepartmentsContainer.displayName = "DepartmentsContainer";
SectionsContainer.displayName = "SectionsContainer";
SubsectionsContainer.displayName = "SubsectionsContainer";
GroupsContainer.displayName = "GroupsContainer";
CategoryItem.displayName = "CategoryItem";
CategoryCode.displayName = "CategoryCode";
LoadingIndicator.displayName = "LoadingIndicator";
CategoryItemContent.displayName = "CategoryItemContent";
CategoryArrow.displayName = "CategoryArrow";
MobileHeader.displayName = "MobileHeader";
MobileBackButton.displayName = "MobileBackButton";
MobileTitle.displayName = "MobileTitle";
MobileCloseButton.displayName = "MobileCloseButton";
Catalog.displayName = "Catalog";

export default Catalog;
