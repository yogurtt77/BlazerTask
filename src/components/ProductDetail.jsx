import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useProductDetails } from "../hooks/useApi";
import { useCart } from "../context/CartContext";
import { useProductImages } from "../hooks/useProductImage";

const ProductDetailContainer = styled.div`
  padding: 24px;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
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

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;
Title.displayName = "Title";

const ProductContent = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;
ProductContent.displayName = "ProductContent";

const ProductImages = styled.div`
  /* width: 560px; */
  flex: 0 0 65%;
  border-radius: 8px;
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex: none;
    flex-direction: column;
    gap: 12px;
  }
`;
ProductImages.displayName = "ProductImages";

const ThumbnailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 8px;
    order: 2;
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;
ThumbnailsColumn.displayName = "ThumbnailsColumn";

const Thumbnail = styled.div`
  width: 176px;
  height: 176px;
  border: 1px solid ${(props) => (props.active ? "#0066cc" : "#e0e0e0")};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }

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

  @media (max-width: 768px) {
    order: 1;
    height: 250px;
    border: 1px solid #e0e0e0;
  }

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

  @media (max-width: 768px) {
    max-width: none;
    max-height: none;
    padding: 16px;
  }
`;
ProductInfo.displayName = "ProductInfo";

const ProductInfoTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  line-height: 150%;
  color: #333;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
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

  @media (max-width: 768px) {
    overflow-x: auto;
    margin-bottom: 16px;
  }
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

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;
  }
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

  @media (max-width: 768px) {
    font-size: 12px;

    th,
    td {
      padding: 8px 12px;
      font-size: 12px;
    }

    /* Скрываем некоторые колонки на мобильных */
    th:nth-child(n + 5),
    td:nth-child(n + 5) {
      display: none;
    }
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

// Функция для загрузки выбранной категории из localStorage
const loadSelectedCategory = () => {
  try {
    const category = localStorage.getItem("priceList.selectedCategory");
    return category ? JSON.parse(category) : null;
  } catch (error) {
    console.error("Ошибка при загрузке выбранной категории:", error);
    return null;
  }
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sellers");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  // Используем React Query для получения данных о продукте
  const { data: product, isLoading, error } = useProductDetails(productId);

  // Используем хук для загрузки изображений товара
  const { images: productImages, isLoading: imagesLoading } =
    useProductImages(productId);

  // Загружаем выбранную категорию при монтировании компонента
  useEffect(() => {
    const category = loadSelectedCategory();
    setSelectedCategory(category);
  }, []);

  // Функция для генерации текста категории для хлебных крошек
  const getCategoryBreadcrumbText = () => {
    if (!selectedCategory) {
      return "Прайс листы";
    }

    // Возвращаем самый глубокий уровень категории
    if (selectedCategory.groupName) {
      return selectedCategory.groupName;
    } else if (selectedCategory.subsectionName) {
      return selectedCategory.subsectionName;
    } else if (selectedCategory.sectionName) {
      return selectedCategory.sectionName;
    } else if (selectedCategory.departmentName) {
      return selectedCategory.departmentName;
    }

    return "Прайс листы";
  };

  const handleBack = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // Функция для добавления товара в корзину
  const handleAddToCart = (supplier) => {
    // Получаем первое изображение из загруженных или заглушку
    const productImage =
      productImages.length > 0
        ? productImages[0].full
        : "/images/placeholder.png";

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
      image: productImage,
      supplierId: supplier.SupplierId,
      supplierName: supplier.SupplierName,
    };

    addToCart(cartItem);

    // Показываем уведомление пользователю
    alert("Товар добавлен в корзину");
  };

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
        <span aria-current="page">
          {product ? product.MaterialName : "Загрузка..."}
        </span>
      </Breadcrumbs>

      <Title as="h1">{product ? product.MaterialName : "Загрузка..."}</Title>

      <ProductContent>
        <ProductImages as="section" aria-label="Изображения продукта">
          <ThumbnailsColumn>
            {imagesLoading
              ? // Показываем скелетон во время загрузки
                Array.from({ length: 3 }).map((_, index) => (
                  <Thumbnail key={index} style={{ backgroundColor: "#f5f5f5" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      Загрузка...
                    </div>
                  </Thumbnail>
                ))
              : productImages.length > 0
              ? productImages.map((image, index) => (
                  <Thumbnail
                    key={index}
                    active={activeImageIndex === index}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Миниатюра ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                  >
                    <img
                      src={image.thumbnail}
                      alt={`${image.alt} - миниатюра`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                  </Thumbnail>
                ))
              : // Показываем заглушки если нет изображений
                Array.from({ length: 3 }).map((_, index) => (
                  <Thumbnail key={index}>
                    <img
                      src="/images/placeholder.png"
                      alt={`Заглушка ${index + 1}`}
                    />
                  </Thumbnail>
                ))}
          </ThumbnailsColumn>
          <MainImage>
            {imagesLoading ? (
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                Загрузка изображения...
              </div>
            ) : productImages.length > 0 ? (
              <img
                src={productImages[activeImageIndex].full}
                alt={productImages[activeImageIndex].alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.png";
                }}
              />
            ) : (
              // Заглушка когда нет изображений
              <img src="/images/placeholder.png" alt="Изображение товара" />
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
