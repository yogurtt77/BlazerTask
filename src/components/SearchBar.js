import React from "react";
import styled from "styled-components";
import Catalog from "./Catalog";
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

const CatalogButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  width: 220px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex-grow: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 40px;
  background-color: #0066cc;
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const RegionSelector = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  width: 220px;

  svg {
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
`;

const MobileSearchContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 16px;
  }
`;

const SearchBar = () => {
  return (
    <>
      <SearchContainer>
        <Catalog />

        <SearchInputContainer>
          <SearchInput placeholder="Поиск по каталогу" />
          <SearchButton>
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

        <RegionSelector>
          Весь Казахстан
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
        </RegionSelector>
      </SearchContainer>

      <MobileSearchContainer>
        <CitySelector />
      </MobileSearchContainer>
    </>
  );
};

export default SearchBar;
