import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useProductDetails } from "../hooks/useApi";
import { useCart } from "../context/CartContext";

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

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sellers");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  // Используем React Query для получения данных о продукте
  const { data: product, isLoading, error } = useProductDetails(productId);

  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // Функция для добавления товара в корзину
  const handleAddToCart = (supplier) => {
    // Создаем объект товара с правильными именами свойств для корзины
    const cartItem = {
      id: product.MaterialId + "-" + supplier.SupplierId, // Уникальный ID для товара от конкретного поставщика
      title: `${product.MaterialName} (${supplier.SupplierName})`,
      retailPrice: supplier.RetailPrice
        ? parseFloat(supplier.RetailPrice)
        : null,
      wholesalePrice: supplier.WholesalePrice
        ? parseFloat(supplier.WholesalePrice)
        : null,
      image: product.ImageUrl || "/images/CardImage.png",
      supplierId: supplier.SupplierId,
      supplierName: supplier.SupplierName,
    };

    addToCart(cartItem);

    // Показываем уведомление пользователю
    alert("Товар добавлен в корзину");
  };

  // Создаем массив изображений на основе данных продукта
  const productImages = product
    ? [
        {
          thumbnail: product.ImageUrl || "/images/CardImage.png",
          full: product.ImageUrl || "/images/CardImage.png",
          alt: `${product.MaterialName || "Товар"} - изображение 1`,
        },
        {
          thumbnail: product.ImageUrl || "/images/CardImage.png",
          full: product.ImageUrl || "/images/CardImage.png",
          alt: `${product.MaterialName || "Товар"} - изображение 2`,
        },
        {
          thumbnail: product.ImageUrl || "/images/CardImage.png",
          full: product.ImageUrl || "/images/CardImage.png",
          alt: `${product.MaterialName || "Товар"} - изображение 3`,
        },
      ]
    : [];

  // Используем данные о поставщиках из объекта product или пустой массив, если данных нет
  const suppliers = product && product.Suppliers ? product.Suppliers : [];

  if (isLoading) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          Загрузка данных...
        </div>
      </ProductDetailContainer>
    );
  }

  if (error) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Ошибка: {error.message || "Произошла ошибка"}. Пожалуйста, обновите
          страницу или попробуйте позже.
        </div>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Продукт не найден. <Link to="/price-list">Вернуться к списку</Link>
        </div>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer as="article">
      <Breadcrumbs as="nav" aria-label="Хлебные крошки">
        <BackButton onClick={handleBack} aria-label="Вернуться назад">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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
        <Link to="/price-list">Прайс листы</Link>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Link to="/price-list">Проект листовой холодный</Link>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span aria-current="page">
          {product ? product.MaterialName : "Загрузка..."}
        </span>
      </Breadcrumbs>

      <Title as="h1">{product ? product.MaterialName : "Загрузка..."}</Title>

      <ProductContent>
        <ProductImages as="section" aria-label="Изображения продукта">
          <ThumbnailsColumn>
            {productImages.map((image, index) => (
              <Thumbnail
                key={index}
                active={activeImageIndex === index}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Миниатюра ${index + 1}`}
                aria-pressed={activeImageIndex === index}
              >
                <img src={image.thumbnail} alt={`${image.alt} - миниатюра`} />
              </Thumbnail>
            ))}
          </ThumbnailsColumn>
          <MainImage>
            {productImages.length > 0 ? (
              <img
                src={productImages[activeImageIndex].full}
                alt={productImages[activeImageIndex].alt}
              />
            ) : (
              <img src="/images/CardImage.png" alt="Изображение товара" />
            )}
          </MainImage>
        </ProductImages>

        <ProductInfo as="section" aria-label="Информация о продукте">
          <ProductInfoTitle as="h2">
            {product ? product.MaterialName : "Загрузка..."}
          </ProductInfoTitle>

          <PriceInfo>
            <PriceRow>
              <span>Сред. розн. цена:</span>
              <Price bold>
                {product ? `${product.RetailPrice || "По запросу"} ₸` : "—"}
              </Price>
            </PriceRow>
            <PriceRow>
              <span>Сред. опт. цена:</span>
              <Price>
                {product ? `${product.WholesalePrice || "По запросу"} ₸` : "—"}
              </Price>
            </PriceRow>
            <PriceRow>
              <span>Поставщиков</span>
              <Price bold>{product ? product.SuppliersCount || 0 : "—"}</Price>
            </PriceRow>
          </PriceInfo>

          <ButtonsContainer>
            <PrimaryButton aria-label="Выбрать поставщика">
              Выбрать поставщика
            </PrimaryButton>
            <SecondaryButton aria-label="Стать поставщиком">
              Стать поставщиком
            </SecondaryButton>
          </ButtonsContainer>
        </ProductInfo>
      </ProductContent>

      <TabsContainer as="section" aria-label="Детальная информация">
        <TabsHeader role="tablist">
          <Tab
            role="tab"
            id="tab-sellers"
            aria-controls="panel-sellers"
            aria-selected={activeTab === "sellers"}
            active={activeTab === "sellers"}
            onClick={() => setActiveTab("sellers")}
          >
            ПРОДАВЦЫ
          </Tab>
          <Tab
            role="tab"
            id="tab-specs"
            aria-controls="panel-specs"
            aria-selected={activeTab === "specs"}
            active={activeTab === "specs"}
            onClick={() => setActiveTab("specs")}
          >
            ХАРАКТЕРИСТИКИ
          </Tab>
          <Tab
            role="tab"
            id="tab-description"
            aria-controls="panel-description"
            aria-selected={activeTab === "description"}
            active={activeTab === "description"}
            onClick={() => setActiveTab("description")}
          >
            ОПИСАНИЕ
          </Tab>
        </TabsHeader>

        <TabContent
          role="tabpanel"
          id="panel-sellers"
          aria-labelledby="tab-sellers"
          hidden={activeTab !== "sellers"}
          active={activeTab === "sellers"}
        >
          <Table>
            <thead>
              <tr>
                <th scope="col">Поставщик</th>
                <th scope="col">Ответственный</th>
                <th scope="col">Розница</th>
                <th scope="col">Оптовая</th>
                <th scope="col">Ед.изм.</th>
                <th scope="col">Регион</th>
                <th scope="col">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.SupplierId}>
                  <td>{supplier.SupplierName}</td>
                  <td>{supplier.ManagerName || "Не указан"}</td>
                  <td>{supplier.RetailPrice || "По запросу"}</td>
                  <td>{supplier.WholesalePrice || "По запросу"}</td>
                  <td>{supplier.UnitOfMeasure || "шт."}</td>
                  <td>{supplier.Region || "Не указан"}</td>
                  <td>
                    <PrimaryButton
                      aria-label={`Добавить в корзину товар от поставщика ${supplier.SupplierName}`}
                      onClick={() => handleAddToCart(supplier)}
                    >
                      В корзину
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TabContent>

        <TabContent
          role="tabpanel"
          id="panel-specs"
          aria-labelledby="tab-specs"
          hidden={activeTab !== "specs"}
          active={activeTab === "specs"}
        >
          <Table>
            <tbody>
              {product && product.Specifications ? (
                Object.entries(product.Specifications).map(([key, value]) => (
                  <tr key={key}>
                    <th scope="row">
                      {key === "Diameter"
                        ? "Диаметр"
                        : key === "Type"
                        ? "Тип"
                        : key === "Material"
                        ? "Материал"
                        : key === "Purpose"
                        ? "Назначение"
                        : key === "Thickness"
                        ? "Толщина"
                        : key === "Color"
                        ? "Цвет"
                        : key}
                    </th>
                    <td>{value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Характеристики не указаны</td>
                </tr>
              )}
            </tbody>
          </Table>
        </TabContent>

        <TabContent
          role="tabpanel"
          id="panel-description"
          aria-labelledby="tab-description"
          hidden={activeTab !== "description"}
          active={activeTab === "description"}
        >
          {product && product.Description ? (
            <div>
              {product.Description.split(". ").map((sentence, index) => (
                <p key={index}>
                  {sentence.trim() + (sentence.endsWith(".") ? "" : ".")}
                </p>
              ))}
            </div>
          ) : (
            <p>Описание отсутствует</p>
          )}
        </TabContent>
      </TabsContainer>
    </ProductDetailContainer>
  );
};

ProductDetail.displayName = "ProductDetail";

export default ProductDetail;
