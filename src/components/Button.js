import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.primary && `
    background-color: #0066cc;
    color: white;
    
    &:hover {
      background-color: #0055b3;
    }
  `}
  
  ${props => props.secondary && `
    background-color: white;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

const Button = ({ children, primary, secondary, onClick, ...props }) => {
  return (
    <StyledButton 
      primary={primary} 
      secondary={secondary} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
