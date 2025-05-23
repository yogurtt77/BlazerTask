import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useCatalog } from "../hooks/useApi";

const CatalogContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 272px; /* Фиксированная ширина как на фото */
  z-index: 1000; /* Убедимся, что каталог отображается поверх других элементов */
`;

const CatalogButton = styled.button`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #d5d5d6;
  border-radius: 8px;
  padding: 16px;
  font-size: 17px;
  cursor: pointer;
  width: 100%;
  justify-content: space-between;

  svg,
  img {
    margin-left: 8px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  }
`;

const CatalogDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: auto;
  min-width: 272px;
  max-width: 1088px; /* 272px * 4 колонки */
  background-color: white;
  border: 1px solid #d5d5d6;
  border-radius: 8px;
  margin-top: 8px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  max-height: 80vh;
  overflow: hidden;

  /* Убедимся, что выпадающий список не обрезается */
  @media (max-width: 1200px) {
    right: 0;
    left: auto;
  }
`;

const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const HierarchyContainer = styled.div`
  display: flex;
  height: 500px;
  overflow-x: auto;
  overflow-y: hidden;
  width: auto;
  min-width: 272px;
  max-width: 1088px; /* 272px * 4 колонки */
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d5d5d6;
    border-radius: 3px;
  }

  /* Убедимся, что колонки отображаются правильно */
  & > div {
    flex: 0 0 272px;
    width: 272px;
  }
`;

const CategoryColumn = styled.div`
  width: 272px;
  min-width: 272px;
  flex: 0 0 272px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 2px; /* Добавляем небольшие отступы по бокам */

  &:last-child {
    border-right: none;
  }
`;

const CategoryItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  background-color: ${(props) => (props.active ? "#f5f5f5" : "white")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: background-color 0.2s ease;
  font-size: 13px; /* Уменьшенный размер текста */

  &:hover {
    background-color: #f9f9f9;
  }
`;

const CategoryItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  white-space: normal; /* Разрешаем перенос текста */
  word-wrap: break-word; /* Разрешаем перенос длинных слов */
  line-height: 1.3; /* Уменьшаем межстрочный интервал */
  max-width: 240px; /* Ограничиваем ширину текста */
`;

const CategoryCode = styled.span`
  color: #666;
  font-size: 13px;
  min-width: 60px;
  display: ${(props) => (props.hideInProduction ? "none" : "inline")};
`;

const CategoryArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  flex-shrink: 0;

  img {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.expanded ? "rotate(90deg)" : "rotate(0)")};
  }
`;

const CatalogHierarchical = ({ onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSubsection, setActiveSubsection] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  // Состояние для отображения колонок
  const [showSections, setShowSections] = useState(false);
  const [showSubsections, setShowSubsections] = useState(false);
  const [showGroups, setShowGroups] = useState(false);

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

      // Создаем структуру разделов
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

        // Создаем структуру подразделов
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

          // Создаем структуру групп
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

  const handleDepartmentClick = (departmentId) => {
    if (activeDepartment === departmentId) {
      // Если нажали на тот же отдел, скрываем разделы
      setActiveDepartment(null);
      setActiveSection(null);
      setActiveSubsection(null);
      setActiveGroup(null);
      setShowSections(false);
      setShowSubsections(false);
      setShowGroups(false);

      // Сбрасываем фильтр
      if (onCategorySelect) {
        onCategorySelect(null);
      }
    } else {
      // Если нажали на другой отдел, показываем его разделы
      setActiveDepartment(departmentId);
      setActiveSection(null);
      setActiveSubsection(null);
      setActiveGroup(null);

      // Важно: сначала устанавливаем showSections в true
      setShowSections(true);
      setShowSubsections(false);
      setShowGroups(false);

      // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом
      if (onCategorySelect && catalogData && catalogData[departmentId]) {
        onCategorySelect({
          department: departmentId,
          departmentName: catalogData[departmentId].name,
          section: null,
          sectionName: null,
          subsection: null,
          subsectionName: null,
          group: null,
          groupName: null,
        });
      }

      // Добавляем небольшую задержку для анимации
      setTimeout(() => {
        // Проверяем, что отдел все еще активен
        if (activeDepartment === departmentId) {
          // Убедимся, что разделы видны
          setShowSections(true);
        }
      }, 50);
    }
  };

  const handleSectionClick = (sectionId) => {
    if (activeSection === sectionId) {
      // Если нажали на тот же раздел, скрываем подразделы
      setActiveSection(null);
      setActiveSubsection(null);
      setActiveGroup(null);
      setShowSubsections(false);
      setShowGroups(false);

      // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом
      if (onCategorySelect && catalogData && catalogData[activeDepartment]) {
        onCategorySelect({
          department: activeDepartment,
          departmentName: catalogData[activeDepartment].name,
          section: null,
          sectionName: null,
          subsection: null,
          subsectionName: null,
          group: null,
          groupName: null,
        });
      }
    } else {
      // Если нажали на другой раздел, показываем его подразделы
      setActiveSection(sectionId);
      setActiveSubsection(null);
      setActiveGroup(null);
      setShowSubsections(true);
      setShowGroups(false);

      // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом и разделом
      if (
        onCategorySelect &&
        catalogData &&
        catalogData[activeDepartment] &&
        catalogData[activeDepartment].sections &&
        catalogData[activeDepartment].sections[sectionId]
      ) {
        onCategorySelect({
          department: activeDepartment,
          departmentName: catalogData[activeDepartment].name,
          section: sectionId,
          sectionName: catalogData[activeDepartment].sections[sectionId].name,
          subsection: null,
          subsectionName: null,
          group: null,
          groupName: null,
        });
      }
    }
  };

  const handleSubsectionClick = (subsectionId) => {
    if (activeSubsection === subsectionId) {
      // Если нажали на тот же подраздел, скрываем группы
      setActiveSubsection(null);
      setActiveGroup(null);
      setShowGroups(false);

      // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом и разделом
      if (
        onCategorySelect &&
        catalogData &&
        catalogData[activeDepartment] &&
        catalogData[activeDepartment].sections &&
        catalogData[activeDepartment].sections[activeSection]
      ) {
        onCategorySelect({
          department: activeDepartment,
          departmentName: catalogData[activeDepartment].name,
          section: activeSection,
          sectionName:
            catalogData[activeDepartment].sections[activeSection].name,
          subsection: null,
          subsectionName: null,
          group: null,
          groupName: null,
        });
      }
    } else {
      // Если нажали на другой подраздел, показываем его группы
      setActiveSubsection(subsectionId);
      setActiveGroup(null);
      setShowGroups(true);

      // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом, разделом и подразделом
      if (
        onCategorySelect &&
        catalogData &&
        catalogData[activeDepartment] &&
        catalogData[activeDepartment].sections &&
        catalogData[activeDepartment].sections[activeSection] &&
        catalogData[activeDepartment].sections[activeSection].subsections &&
        catalogData[activeDepartment].sections[activeSection].subsections[
          subsectionId
        ]
      ) {
        onCategorySelect({
          department: activeDepartment,
          departmentName: catalogData[activeDepartment].name,
          section: activeSection,
          sectionName:
            catalogData[activeDepartment].sections[activeSection].name,
          subsection: subsectionId,
          subsectionName:
            catalogData[activeDepartment].sections[activeSection].subsections[
              subsectionId
            ].name,
          group: null,
          groupName: null,
        });
      }
    }
  };

  const handleGroupClick = (groupId) => {
    if (activeGroup === groupId) {
      // Если нажали на ту же группу, снимаем выбор
      setActiveGroup(null);

      // Вызываем функцию фильтрации ТОЛЬКО с выбранным отделом, разделом и подразделом
      if (
        onCategorySelect &&
        catalogData &&
        catalogData[activeDepartment] &&
        catalogData[activeDepartment].sections &&
        catalogData[activeDepartment].sections[activeSection] &&
        catalogData[activeDepartment].sections[activeSection].subsections &&
        catalogData[activeDepartment].sections[activeSection].subsections[
          activeSubsection
        ]
      ) {
        onCategorySelect({
          department: activeDepartment,
          departmentName: catalogData[activeDepartment].name,
          section: activeSection,
          sectionName:
            catalogData[activeDepartment].sections[activeSection].name,
          subsection: activeSubsection,
          subsectionName:
            catalogData[activeDepartment].sections[activeSection].subsections[
              activeSubsection
            ].name,
          group: null,
          groupName: null,
        });
      }
    } else {
      // Если нажали на другую группу, выбираем ее
      setActiveGroup(groupId);

      // Вызываем функцию фильтрации с полной иерархией до группы
      if (
        onCategorySelect &&
        catalogData &&
        catalogData[activeDepartment] &&
        catalogData[activeDepartment].sections &&
        catalogData[activeDepartment].sections[activeSection] &&
        catalogData[activeDepartment].sections[activeSection].subsections &&
        catalogData[activeDepartment].sections[activeSection].subsections[
          activeSubsection
        ] &&
        catalogData[activeDepartment].sections[activeSection].subsections[
          activeSubsection
        ].groups
      ) {
        const groupName =
          catalogData[activeDepartment].sections[activeSection].subsections[
            activeSubsection
          ].groups[groupId];

        onCategorySelect({
          department: activeDepartment,
          departmentName: catalogData[activeDepartment].name,
          section: activeSection,
          sectionName:
            catalogData[activeDepartment].sections[activeSection].name,
          subsection: activeSubsection,
          subsectionName:
            catalogData[activeDepartment].sections[activeSection].subsections[
              activeSubsection
            ].name,
          group: groupId,
          groupName: groupName,
        });
      }
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
          <HierarchyContainer>
            {/* Отделы - всегда видимы */}
            <CategoryColumn>
              {catalogData &&
                Object.entries(catalogData).map(
                  ([departmentId, department]) => (
                    <CategoryItem
                      key={departmentId}
                      active={departmentId === activeDepartment}
                      onClick={() => handleDepartmentClick(departmentId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode hideInProduction={true}>
                          {departmentId}
                        </CategoryCode>
                        {department.name}
                      </CategoryItemContent>
                      <CategoryArrow
                        expanded={departmentId === activeDepartment}
                      >
                        <img src="/icons/arrow-right.svg" alt="" />
                      </CategoryArrow>
                    </CategoryItem>
                  )
                )}
            </CategoryColumn>

            {/* Разделы - видимы только если выбран отдел */}
            {showSections && (
              <CategoryColumn>
                {Object.entries(getActiveSections()).map(
                  ([sectionId, section]) => (
                    <CategoryItem
                      key={sectionId}
                      active={sectionId === activeSection}
                      onClick={() => handleSectionClick(sectionId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode hideInProduction={true}>
                          {sectionId}
                        </CategoryCode>
                        {section.name}
                      </CategoryItemContent>
                      <CategoryArrow expanded={sectionId === activeSection}>
                        <img src="/icons/arrow-right.svg" alt="" />
                      </CategoryArrow>
                    </CategoryItem>
                  )
                )}
              </CategoryColumn>
            )}

            {/* Подразделы - видимы только если выбран раздел */}
            {showSubsections && (
              <CategoryColumn>
                {Object.entries(getActiveSubsections()).map(
                  ([subsectionId, subsection]) => (
                    <CategoryItem
                      key={subsectionId}
                      active={subsectionId === activeSubsection}
                      onClick={() => handleSubsectionClick(subsectionId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode hideInProduction={true}>
                          {subsectionId}
                        </CategoryCode>
                        {subsection.name}
                      </CategoryItemContent>
                      <CategoryArrow
                        expanded={subsectionId === activeSubsection}
                      >
                        <img src="/icons/arrow-right.svg" alt="" />
                      </CategoryArrow>
                    </CategoryItem>
                  )
                )}
              </CategoryColumn>
            )}

            {/* Группы - видимы только если выбран подраздел */}
            {showGroups && (
              <CategoryColumn>
                {Object.entries(getActiveGroups()).map(
                  ([groupId, groupName]) => (
                    <CategoryItem
                      key={groupId}
                      active={groupId === activeGroup}
                      onClick={() => handleGroupClick(groupId)}
                    >
                      <CategoryItemContent>
                        <CategoryCode hideInProduction={true}>
                          {groupId}
                        </CategoryCode>
                        {groupName}
                      </CategoryItemContent>
                    </CategoryItem>
                  )
                )}
              </CategoryColumn>
            )}
          </HierarchyContainer>
        )}
      </CatalogDropdown>
    </CatalogContainer>
  );
};

export default CatalogHierarchical;
