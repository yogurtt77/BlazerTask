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

const CategoryContainer = styled.div`
  display: flex;
  height: 500px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100%;
  }
`;

const DepartmentsContainer = styled.div`
  width: 25%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 25%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SectionsContainer = styled.div`
  width: 25%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 25%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SubsectionsContainer = styled.div`
  width: 25%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 25%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const GroupsContainer = styled.div`
  width: 25%;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 25%;
  }
`;

const CategoryItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 13px;
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

const CategoryHeader = styled.div`
  padding: 12px 16px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
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

const Catalog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [catalogData, setCatalogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeDepartment, setActiveDepartment] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSubsection, setActiveSubsection] = useState(null);

  const catalogRef = useRef(null);

  // Загрузка данных каталога
  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные каталога");
        }
        const data = await response.json();
        setCatalogData(data);

        // Устанавливаем первый отдел как активный по умолчанию
        if (data && Object.keys(data).length > 0) {
          const firstDepartmentId = Object.keys(data)[0];
          setActiveDepartment(firstDepartmentId);

          // Устанавливаем первый раздел как активный по умолчанию
          const firstDepartment = data[firstDepartmentId];
          if (
            firstDepartment &&
            firstDepartment.sections &&
            Object.keys(firstDepartment.sections).length > 0
          ) {
            const firstSectionId = Object.keys(firstDepartment.sections)[0];
            setActiveSection(firstSectionId);

            // Устанавливаем первый подраздел как активный по умолчанию
            const firstSection = firstDepartment.sections[firstSectionId];
            if (
              firstSection &&
              firstSection.subsections &&
              Object.keys(firstSection.subsections).length > 0
            ) {
              const firstSubsectionId = Object.keys(
                firstSection.subsections
              )[0];
              setActiveSubsection(firstSubsectionId);
            }
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Ошибка при загрузке данных каталога:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && !catalogData) {
      fetchCatalogData();
    }
  }, [isOpen, catalogData]);

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
    setActiveDepartment(departmentId);

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
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);

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
  };

  const handleSubsectionClick = (subsectionId) => {
    setActiveSubsection(subsectionId);
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

        {loading ? (
          <LoadingIndicator>Загрузка каталога...</LoadingIndicator>
        ) : error ? (
          <LoadingIndicator>Ошибка: {error}</LoadingIndicator>
        ) : (
          <CategoryContainer>
            {/* Отделы */}
            <DepartmentsContainer>
              <CategoryHeader>Отделы</CategoryHeader>
              {catalogData &&
                Object.entries(catalogData).map(
                  ([departmentId, department]) => (
                    <CategoryItem
                      key={departmentId}
                      active={departmentId === activeDepartment}
                      onClick={() => handleDepartmentClick(departmentId)}
                    >
                      <CategoryCode>{departmentId}</CategoryCode>
                      {department.name}
                    </CategoryItem>
                  )
                )}
            </DepartmentsContainer>

            {/* Разделы */}
            <SectionsContainer>
              <CategoryHeader>Разделы</CategoryHeader>
              {Object.entries(getActiveSections()).map(
                ([sectionId, section]) => (
                  <CategoryItem
                    key={sectionId}
                    active={sectionId === activeSection}
                    onClick={() => handleSectionClick(sectionId)}
                  >
                    <CategoryCode>{sectionId}</CategoryCode>
                    {section.name}
                  </CategoryItem>
                )
              )}
            </SectionsContainer>

            {/* Подразделы */}
            <SubsectionsContainer>
              <CategoryHeader>Подразделы</CategoryHeader>
              {Object.entries(getActiveSubsections()).map(
                ([subsectionId, subsection]) => (
                  <CategoryItem
                    key={subsectionId}
                    active={subsectionId === activeSubsection}
                    onClick={() => handleSubsectionClick(subsectionId)}
                  >
                    <CategoryCode>{subsectionId}</CategoryCode>
                    {subsection.name}
                  </CategoryItem>
                )
              )}
            </SubsectionsContainer>

            {/* Группы */}
            <GroupsContainer>
              <CategoryHeader>Группы</CategoryHeader>
              {Object.entries(getActiveGroups()).map(([groupId, groupName]) => (
                <CategoryItem key={groupId}>
                  <CategoryCode>{groupId}</CategoryCode>
                  {groupName}
                </CategoryItem>
              ))}
            </GroupsContainer>
          </CategoryContainer>
        )}
      </CatalogDropdown>
    </CatalogContainer>
  );
};

export default Catalog;
