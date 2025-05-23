import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
`;
PaginationContainer.displayName = "PaginationContainer";

const PageButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin: 0 4px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? "#0066cc" : "#ddd")};
  background-color: ${(props) => (props.active ? "#0066cc" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#0066cc" : "#f5f5f5")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f5f5f5;
  }
`;
PageButton.displayName = "PageButton";

const PageInfo = styled.div`
  margin: 0 16px;
  font-size: 14px;
  color: #666;
`;
PageInfo.displayName = "PageInfo";

/**
 * Компонент пагинации
 * @param {Object} props - Свойства компонента
 * @param {number} props.currentPage - Текущая страница
 * @param {number} props.totalPages - Общее количество страниц
 * @param {number} props.totalItems - Общее количество элементов
 * @param {number} props.pageSize - Размер страницы
 * @param {Function} props.onPageChange - Функция для изменения страницы
 * @returns {JSX.Element} - Компонент пагинации
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  // Функция для генерации массива номеров страниц для отображения
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Максимальное количество кнопок страниц для отображения

    if (totalPages <= maxPagesToShow) {
      // Если общее количество страниц меньше или равно максимальному количеству для отображения,
      // показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Иначе показываем страницы вокруг текущей
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Добавляем многоточие в начало, если нужно
      if (startPage > 1) {
        pageNumbers.unshift("...");
        pageNumbers.unshift(1);
      }

      // Добавляем многоточие в конец, если нужно
      if (endPage < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Вычисляем диапазон отображаемых элементов
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <PaginationContainer role="navigation" aria-label="Пагинация">
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </PageButton>

      {getPageNumbers().map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === "..." ? (
            <PageInfo>...</PageInfo>
          ) : (
            <PageButton
              active={pageNumber === currentPage}
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Страница ${pageNumber}`}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </PageButton>
          )}
        </React.Fragment>
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </PageButton>

      <PageInfo>
        Показано {startItem}-{endItem} из {totalItems}
      </PageInfo>
    </PaginationContainer>
  );
};

Pagination.displayName = "Pagination";

export default Pagination;
