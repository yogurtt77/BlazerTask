import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import CatalogHierarchical from "./CatalogHierarchical";
import CitySelector from "./CitySelector";

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 16px;
    gap: 12px;
  }
`;
SearchContainer.displayName = "SearchContainer";

const SearchInputContainer = styled.div`
  position: relative;
  flex-grow: 1;
`;
SearchInputContainer.displayName = "SearchInputContainer";

const SearchInput = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #d5d5d6;
  border-radius: 8px;
  font-size: 17px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;
SearchInput.displayName = "SearchInput";

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 52px;
  background-color: #0066cc;
  border: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;
SearchButton.displayName = "SearchButton";

const RegionSelector = styled.div`
  position: relative;
  width: 220px;
  max-width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
RegionSelector.displayName = "RegionSelector";

const RegionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 12px;
  background-color: white;
  border: 1px solid #d5d5d6;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  width: 100%;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: left;
    margin-right: 8px;
    font-size: ${(props) => (props.longText ? "12px" : "14px")};
  }

  svg {
    width: 16px;
    height: 16px;
    min-width: 16px; /* Предотвращает сжатие иконки */
    margin-left: 8px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  }
`;
RegionButton.displayName = "RegionButton";

const RegionDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  min-width: 220px;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;
RegionDropdown.displayName = "RegionDropdown";

const RegionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
RegionList.displayName = "RegionList";

const RegionItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  white-space: normal;
  line-height: 1.3;
  word-wrap: break-word;

  &:hover {
    background-color: #f5f5f5;
  }
`;
RegionItem.displayName = "RegionItem";

const MobileSearchContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 16px;
  }
`;
MobileSearchContainer.displayName = "MobileSearchContainer";

const SearchBarHierarchical = ({ onCategorySelect, onSearch }) => {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Весь Казахстан");
  const [searchQuery, setSearchQuery] = useState("");
  const regionRef = useRef(null);

  const regions = [
    "Весь Казахстан",
    "Нур-Султан",
    "Алматы",
    "Актюбинская область",
    "Алматинская область",
    "Атырауская область",
    "Западно-Казахстанская область",
    "Жамбылская область",
    "Карагандинская область",
    "Костанайская область",
    "Кызылординская область",
    "Мангистауская область",
    "Туркестанская область",
    "Павлодарская область",
    "Северо-Казахстанская область",
    "Восточно-Казахстанская область",
    "Акмолинская область",
    "Шымкент",
  ];

  const toggleRegionDropdown = () => {
    setIsRegionOpen(!isRegionOpen);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionOpen(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Вызываем функцию поиска с задержкой для уменьшения количества запросов
    if (onSearch) {
      // Используем setTimeout для дебаунсинга
      const timeoutId = setTimeout(() => {
        onSearch(query);
      }, 300);

      // Очищаем предыдущий таймаут при новом вводе
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSearchButtonClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Закрываем выпадающий список при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <SearchContainer>
        <CatalogHierarchical onCategorySelect={onCategorySelect} />

        <SearchInputContainer>
          <SearchInput
            placeholder="Поиск по каталогу"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchButton onClick={handleSearchButtonClick}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 15L11 11"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SearchButton>
        </SearchInputContainer>

        <RegionSelector ref={regionRef}>
          <RegionButton
            onClick={toggleRegionDropdown}
            isOpen={isRegionOpen}
            longText={selectedRegion.length > 15}
          >
            <span>{selectedRegion}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RegionButton>

          <RegionDropdown isOpen={isRegionOpen}>
            <RegionList>
              {regions.map((region, index) => (
                <RegionItem
                  key={index}
                  onClick={() => handleRegionSelect(region)}
                >
                  {region}
                </RegionItem>
              ))}
            </RegionList>
          </RegionDropdown>
        </RegionSelector>
      </SearchContainer>

      <MobileSearchContainer>
        <CitySelector />
      </MobileSearchContainer>
    </>
  );
};

SearchBarHierarchical.displayName = "SearchBarHierarchical";

export default SearchBarHierarchical;
