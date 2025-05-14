import React, { useState } from "react";
import styled from "styled-components";

const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
`;
SelectorContainer.displayName = "SelectorContainer";

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  svg {
    margin-left: 8px;
  }
`;
SelectorButton.displayName = "SelectorButton";

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;
DropdownContainer.displayName = "DropdownContainer";

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`;
SearchInput.displayName = "SearchInput";

const CityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
CityList.displayName = "CityList";

const CityItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f5f5f5;
  }
`;
CityItem.displayName = "CityItem";

const CitySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Алматы");
  const [searchTerm, setSearchTerm] = useState("");

  const cities = [
    "Алматы",
    "Астана",
    "Шымкент",
    "Караганда",
    "Актобе",
    "Тараз",
    "Павлодар",
    "Усть-Каменогорск",
    "Семей",
    "Атырау",
    "Костанай",
    "Кызылорда",
    "Уральск",
    "Петропавловск",
    "Актау",
    "Темиртау",
    "Туркестан",
    "Кокшетау",
    "Талдыкорган",
    "Экибастуз",
  ];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SelectorContainer>
      <SelectorButton onClick={toggleDropdown}>
        {selectedCity}
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
      </SelectorButton>

      <DropdownContainer isOpen={isOpen}>
        <SearchInput
          placeholder="Поиск города"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <CityList>
          {filteredCities.map((city, index) => (
            <CityItem key={index} onClick={() => handleCitySelect(city)}>
              {city}
            </CityItem>
          ))}
        </CityList>
      </DropdownContainer>
    </SelectorContainer>
  );
};

SelectorContainer.displayName = "SelectorContainer";
SelectorButton.displayName = "SelectorButton";
DropdownContainer.displayName = "DropdownContainer";
SearchInput.displayName = "SearchInput";
CityList.displayName = "CityList";
CityItem.displayName = "CityItem";

CitySelector.displayName = "CitySelector";

export default CitySelector;
