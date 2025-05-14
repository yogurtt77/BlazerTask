import React, { useState } from "react";
import styled from "styled-components";

const ProductDetailContainer = styled.div`
  padding: 24px;
  flex-grow: 1;
`;
ProductDetailContainer.displayName = "ProductDetailContainer";

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
Breadcrumbs.displayName = "Breadcrumbs";

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
BackButton.displayName = "BackButton";

const Title = styled.h1`
  font-size: 42px;
  font-weight: bold;
  max-width: 656px;
  color: #333;
  margin-bottom: 24px;
`;
Title.displayName = "Title";

const ProductContent = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;
ProductContent.displayName = "ProductContent";

const ProductImages = styled.div`
  /* width: 560px; */
  flex: 0 0 65%;
  border-radius: 8px;
  display: flex;
  gap: 16px;
`;
ProductImages.displayName = "ProductImages";

const ThumbnailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
ThumbnailsColumn.displayName = "ThumbnailsColumn";

const Thumbnail = styled.div`
  width: 176px;
  height: 176px;
  border: 1px solid ${(props) => (props.active ? "#0066cc" : "#e0e0e0")};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: white;
  }
`;
Thumbnail.displayName = "Thumbnail";

const MainImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: white;
  }
`;
MainImage.displayName = "MainImage";

const ProductInfo = styled.div`
  max-width: 272px;
  max-height: 380px;
  background-color: white;
  border-radius: 8px;
  padding: 24px 16.5px;
`;
ProductInfo.displayName = "ProductInfo";

const ProductInfoTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  line-height: 150%;
  color: #333;
  margin-bottom: 16px;
`;
ProductInfoTitle.displayName = "ProductInfoTitle";

const PriceInfo = styled.div`
  margin-bottom: 16px;
`;
PriceInfo.displayName = "PriceInfo";

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
  color: #808185;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
`;
PriceRow.displayName = "PriceRow";

const Price = styled.span`
  font-weight: ${(props) => (props.bold ? "600" : "400")};
`;
Price.displayName = "Price";

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
ButtonsContainer.displayName = "ButtonsContainer";

const TabsContainer = styled.div`
  margin-top: 24px;
`;
TabsContainer.displayName = "TabsContainer";

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;
TabsHeader.displayName = "TabsHeader";

const Tab = styled.div`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#0066cc" : "#666")};
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid #0066cc" : "none")};
  margin-bottom: -1px;
`;
Tab.displayName = "Tab";

const TabContent = styled.div`
  display: ${(props) => (props.active ? "block" : "none")};
`;
TabContent.displayName = "TabContent";

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
Table.displayName = "Table";

const StyledButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
`;
StyledButton.displayName = "StyledButton";

const PrimaryButton = styled.button`
  padding: 12px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
  background-color: #0066cc;
  color: white;
  border: none;

  &:hover {
    background-color: #0055b3;
  }
`;
PrimaryButton.displayName = "PrimaryButton";

const SecondaryButton = styled.button`
  padding: 12px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
  background-color: white;
  color: #333;
  border: 2px solid #d6dce1;

  &:hover {
    background-color: #f5f5f5;
  }
`;
SecondaryButton.displayName = "SecondaryButton";

const CartButton = styled(StyledButton)`
  width: 100%;
`;
CartButton.displayName = "CartButton";

const ProductDetail = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState("sellers");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = [
    {
      thumbnail: "/images/CardImage.png",
      full: "/images/CardImage.png",
      alt: "Сверло кольцевое алмазное 1",
    },
    {
      thumbnail: "/images/CardImage.png",
      full: "/images/CardImage.png",
      alt: "Сверло кольцевое алмазное 2",
    },
    {
      thumbnail: "/images/CardImage.png",
      full: "/images/CardImage.png",
      alt: "Сверло кольцевое алмазное 3",
    },
  ];

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
          <ThumbnailsColumn>
            {productImages.map((image, index) => (
              <Thumbnail
                key={index}
                active={activeImageIndex === index}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image.thumbnail} alt={`${image.alt} - миниатюра`} />
              </Thumbnail>
            ))}
          </ThumbnailsColumn>
          <MainImage>
            <img
              src={productImages[activeImageIndex].full}
              alt={productImages[activeImageIndex].alt}
            />
          </MainImage>
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
            <PriceRow>
              <span>Поставщиков</span>
              <Price bold>14</Price>
            </PriceRow>
          </PriceInfo>

          <ButtonsContainer>
            <PrimaryButton>Выбрать поставщика</PrimaryButton>
            <SecondaryButton>Стать поставщиком</SecondaryButton>
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
                    <PrimaryButton>В корзину</PrimaryButton>
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

ProductDetail.displayName = "ProductDetail";

export default ProductDetail;
