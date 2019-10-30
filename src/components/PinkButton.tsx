import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.button<{ width?: string, disabled: boolean }>`
  color: white;
  cursor: pointer;
  padding: 1rem;
  -webkit-appearance: none;
  outline: none;
  background-color: #eb008d;
  border: 0;
  border-radius: 2rem;
  font-size: 1.3rem;
  box-shadow: 0 0.25rem 0.5rem rgba(235, 0, 141, 0.16), 0 0.5rem 1rem rgba(235, 0, 141, 0.2);
  align-self: center;
  width: ${props => props.width || '22rem'};
  margin-bottom: 2rem;
  transition: background-color 300ms cubic-bezier(0.15, 0.5, 0.5, 1) 0s, color 300ms cubic-bezier(0.15, 0.5, 0.5, 1) 0s, opacity 300ms cubic-bezier(0.15, 0.5, 0.5, 1) 0s, box-shadow 200ms cubic-bezier(0.4, 0.3, 0.8, 0.6) 0s;
  
  :disabled {
    background-color: #fac1e4;
    cursor: default;
  }
  
  :hover, :focus {
    background-color: #db0083;
  }
  
  :active {
    background-color: #ca0079;
  }
`;

interface Props {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  width?: string
  disabled?: boolean
  children: ReactNode
  type?: 'button' | 'submit'
}

export const PinkButton = ({ onClick, disabled = false, children, ...rest }: Props) =>
  <Container disabled={disabled} onClick={onClick} {...rest}>
    {children}
  </Container>;
