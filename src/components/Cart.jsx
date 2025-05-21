import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";

const CartContainer = styled.div`
  padding: 24px;
  flex-grow: 1;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
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

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;

  th,
  td {
    padding: 16px;
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
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ProductName = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 16px;
    font-weight: 500;
    color: #333;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #ff3b30;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const StyledButton = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
`;
StyledButton.displayName = "StyledButton";

const PrimaryButton = styled(StyledButton)`
  background-color: #0066cc;
  color: white;
  border: none;

  &:hover {
    background-color: #0055b3;
  }
`;
PrimaryButton.displayName = "PrimaryButton";

const SecondaryButton = styled(StyledButton)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    background-color: #f5f5f5;
  }
`;
SecondaryButton.displayName = "SecondaryButton";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleBack = () => {
    navigate("/");
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId, value) => {
    // Преобразуем строку в число
    const quantity = parseInt(value, 10);

    // Проверяем, что значение является числом и больше 0
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const calculateItemTotal = (item) => {
    // Если цена не указана, возвращаем 0
    if (!item.retailPrice) return 0;
    return item.retailPrice * item.quantity;
  };

  return (
    <CartContainer>
      <Breadcrumbs>
        <BackButton onClick={handleBack}>
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
        <Link to="/">Прайс листы</Link>
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
        <Link to="/">Проект листовой холодный</Link>
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
        <Link to="/">Сверла кольцевые алмазные диаметром 70 мм</Link>
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
        <span>Корзина</span>
      </Breadcrumbs>

      <Title>Корзина</Title>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>
          <p>Ваша корзина пуста</p>
          <ButtonsContainer style={{ justifyContent: "center" }}>
            <SecondaryButton onClick={() => navigate("/")}>
              Перейти к каталогу
            </SecondaryButton>
          </ButtonsContainer>
        </div>
      ) : (
        <>
          <CartTable>
            <thead>
              <tr>
                <th>НАИМЕНОВАНИЕ ТОВАРА</th>
                <th>РОЗНИЦА</th>
                <th>ОПТ</th>
                <th>НЕОБХОДИМОЕ КОЛ.ВО</th>
                <th>ИТОГОВАЯ ЦЕНА</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <ProductName>
                      <img
                        src={item.image || "/images/CardImage.png"}
                        alt={item.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                      />
                      <span>{item.title}</span>
                    </ProductName>
                  </td>
                  <td>
                    {item.retailPrice
                      ? item.retailPrice.toLocaleString()
                      : "По запросу"}{" "}
                    ₸
                  </td>
                  <td>
                    {item.wholesalePrice
                      ? item.wholesalePrice.toLocaleString()
                      : "По запросу"}{" "}
                    ₸
                  </td>
                  <td>
                    <QuantityInput
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      placeholder="Укажите кол.во"
                    />
                  </td>
                  <td>
                    {item.retailPrice
                      ? calculateItemTotal(item).toLocaleString()
                      : "По запросу"}{" "}
                    ₸
                  </td>
                  <td>
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4H3.33333H14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.33334 4V2.66667C5.33334 2.31305 5.47382 1.97391 5.72387 1.72386C5.97392 1.47381 6.31305 1.33334 6.66667 1.33334H9.33334C9.68696 1.33334 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33334 13.687 3.33334 13.3333V4H12.6667Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </RemoveButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CartTable>

          <div
            style={{
              textAlign: "right",
              margin: "16px 0",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Итого: {getCartTotal() > 0 ? getCartTotal().toLocaleString() : 0} ₸
          </div>

          <ButtonsContainer>
            <PrimaryButton>Оформить заказ</PrimaryButton>
            <SecondaryButton>Создать тендер</SecondaryButton>
            <SecondaryButton onClick={() => navigate("/")}>
              Добавить еще позиции
            </SecondaryButton>
          </ButtonsContainer>
        </>
      )}
    </CartContainer>
  );
};

Cart.displayName = "Cart";

export default Cart;
