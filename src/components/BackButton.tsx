import React from 'react';
import styled from 'styled-components';

const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid #ced5db;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  
  :hover, :focus {
    transform: scale(1.035);
    transform-origin: 50% 50%;
    transition: transform 450ms cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

const StyledSvg = styled.svg`
  fill: #8b959e;
  width: 1.5rem;
  height: 1.5rem;
`;

interface Props {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  className?: string
}

export const BackButton = ({ onClick, className }: Props) =>
  <Container onClick={onClick} className={className}>
    <StyledSvg viewBox="0 0 24 24">
      <path d="M16.7070929,4.70712067 C17.0976249,4.31660405 17.0976373,3.68343907 16.7071207,3.29290711 C16.316604,2.90237515 15.6834391,2.90236271 15.2929071,3.29287933 L6.58578644,11.999658 L15.2928793,20.7070929 C15.683396,21.0976249 16.3165609,21.0976373 16.7070929,20.7071207 C17.0976249,20.316604 17.0976373,19.6834391 16.7071207,19.2929071 L9.41421356,11.9997135 L16.7070929,4.70712067 Z" className="" />
    </StyledSvg>
  </Container>;
