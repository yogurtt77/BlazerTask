import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const ProductDetailContainer = styled.div`
  padding: 24px;
  flex-grow: 1;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #0066cc;
    }
  }

  svg {
    margin: 0 8px;
    width: 16px;
    height: 16px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-right: 16px;

  &:hover {
    color: #0066cc;
  }

  svg {
    margin-right: 8px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

const ProductContent = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const ProductImages = styled.div`
  flex: 0 0 60%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
`;

const ProductInfo = styled.div`
  flex: 0 0 35%;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
`;

const ProductInfoTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const PriceInfo = styled.div`
  margin-bottom: 16px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const Price = styled.span`
  font-weight: ${(props) => (props.bold ? "600" : "400")};
`;

const SupplierInfo = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const TabsContainer = styled.div`
  margin-top: 24px;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;

const Tab = styled.div`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#0066cc" : "#666")};
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid #0066cc" : "none")};
  margin-bottom: -1px;
`;

const TabContent = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
  }

  th {
    font-weight: 500;
    color: #333;
    background-color: #f5f5f5;
  }

  td {
    color: #666;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const CartButton = styled(Button)`
  width: 100%;
`;

const ProductDetail = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState("sellers");

  const suppliers = [
    {
      id: 1,
      name: "ТОО MarLinStroy",
      manager: "Шамин Николай",
      retail: "2 350 ₸",
      wholesale: "2 350 ₸",
      unit: "Шт.",
      region: "Алматы",
    },
    {
      id: 2,
      name: "ТОО Snab Royal",
      manager: "Фарид Мухамеджанов",
      retail: "2 350 ₸",
      wholesale: "2 350 ₸",
      unit: "Шт.",
      region: "Нур-Султан",
    },
    {
      id: 3,
      name: "ТОО Кровля Kerabit",
      manager: "Каттабеков Алмаз",
      retail: "2 350 ₸",
      wholesale: "2 350 ₸",
      unit: "Шт.",
      region: "Алматы",
    },
    {
      id: 4,
      name: "Almatherm",
      manager: "Доскалиева Акерке",
      retail: "2 350 ₸",
      wholesale: "2 350 ₸",
      unit: "Шт.",
      region: "Алматы",
    },
    {
      id: 5,
      name: "ИП Адилбеков",
      manager: "Адилбеков Аскар",
      retail: "2 350 ₸",
      wholesale: "2 350 ₸",
      unit: "Шт.",
      region: "Алматы",
    },
  ];

  return (
    <ProductDetailContainer>
      <Breadcrumbs>
        <BackButton onClick={onBack}>
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
          Назад
        </BackButton>
        <a href="#">Прайс листы</a>
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
        <a href="#">Проект листовой холодный</a>
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
        <span>Сверла кольцевые алмазные диаметром 70 мм</span>
      </Breadcrumbs>

      <Title>Сверла кольцевые алмазные диаметром 70 мм</Title>

      <ProductContent>
        <ProductImages>
          <img
            src="https://via.placeholder.com/500x300/FFD700/000000?text=Сверла+кольцевые+алмазные"
            alt="Сверла кольцевые алмазные"
          />
        </ProductImages>

        <ProductInfo>
          <ProductInfoTitle>
            Сверла кольцевые алмазные диаметром 70 мм
          </ProductInfoTitle>

          <PriceInfo>
            <PriceRow>
              <span>Сред. розн. цена:</span>
              <Price bold>2 350 ₸</Price>
            </PriceRow>
            <PriceRow>
              <span>Сред. опт. цена:</span>
              <Price>2 120 ₸</Price>
            </PriceRow>
          </PriceInfo>

          <SupplierInfo>
            <span>Поставщиков</span>
            <Price bold>14</Price>
          </SupplierInfo>

          <ButtonsContainer>
            <CartButton primary>Выбрать поставщика</CartButton>
            <CartButton secondary>Стать поставщиком</CartButton>
          </ButtonsContainer>
        </ProductInfo>
      </ProductContent>

      <TabsContainer>
        <TabsHeader>
          <Tab
            active={activeTab === "sellers"}
            onClick={() => setActiveTab("sellers")}
          >
            ПРОДАВЦЫ
          </Tab>
          <Tab
            active={activeTab === "specs"}
            onClick={() => setActiveTab("specs")}
          >
            ХАРАКТЕРИСТИКИ
          </Tab>
          <Tab
            active={activeTab === "description"}
            onClick={() => setActiveTab("description")}
          >
            ОПИСАНИЕ
          </Tab>
        </TabsHeader>

        <TabContent active={activeTab === "sellers"}>
          <Table>
            <thead>
              <tr>
                <th>Поставщик</th>
                <th>Ответственный</th>
                <th>Розница</th>
                <th>Оптовая</th>
                <th>Ед.изм.</th>
                <th>Регион</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.manager}</td>
                  <td>{supplier.retail}</td>
                  <td>{supplier.wholesale}</td>
                  <td>{supplier.unit}</td>
                  <td>{supplier.region}</td>
                  <td>
                    <Button primary>В корзину</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabContent>

        <TabContent active={activeTab === "specs"}>
          <Table>
            <tbody>
              <tr>
                <td>Диаметр</td>
                <td>70 мм</td>
              </tr>
              <tr>
                <td>Тип</td>
                <td>Алмазное</td>
              </tr>
              <tr>
                <td>Материал</td>
                <td>Сталь с алмазным напылением</td>
              </tr>
              <tr>
                <td>Назначение</td>
                <td>Для сверления отверстий в бетоне, камне, кирпиче</td>
              </tr>
            </tbody>
          </Table>
        </TabContent>

        <TabContent active={activeTab === "description"}>
          <p>
            Сверла кольцевые алмазные диаметром 70 мм предназначены для
            сверления отверстий в твердых материалах, таких как бетон, камень,
            кирпич и т.д. Алмазное напыление обеспечивает высокую
            производительность и долговечность инструмента.
          </p>
          <p>
            Особенности:
            <ul>
              <li>Диаметр сверления: 70 мм</li>
              <li>Высокая скорость сверления</li>
              <li>Долгий срок службы</li>
              <li>Подходит для профессионального использования</li>
            </ul>
          </p>
        </TabContent>
      </TabsContainer>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
