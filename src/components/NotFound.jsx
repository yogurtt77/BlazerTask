import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;
NotFoundContainer.displayName = "NotFoundContainer";

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;
Title.displayName = "Title";

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  max-width: 500px;
`;
Message.displayName = "Message";

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: #0066cc;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0055b3;
  }
`;
HomeLink.displayName = "HomeLink";

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404 - Страница не найдена</Title>
      <Message>
        Извините, запрашиваемая страница не существует или была перемещена.
      </Message>
      <HomeLink to="/">Вернуться на главную</HomeLink>
    </NotFoundContainer>
  );
};

NotFound.displayName = "NotFound";

export default NotFound;
