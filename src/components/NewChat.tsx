import React from "react";
import styled from "styled-components";
import chat from '../assets/chat/chat_white.svg';

const Container = styled.div`
  display: flex;
  padding: 1rem;
  width: 20rem;
  cursor: pointer;
  
  :hover {
    background-color: #f4f5f5;
  }
`;

const Img = styled.div`
  width: 2.5rem; 
  height: 2.5rem;
  background-image: url(${chat});
  background-size: 1.66rem 1.66rem;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #1378e8;
  border-radius: 50%;
`;

const Txt = styled.div`
  font-family: 'Roboto Medium', sans-serif;
  margin-left: .75rem;
  align-self: center;
`;

interface Props {
  onClick: () => void
}

export const NewChat = ({ onClick }: Props) =>
  <Container onClick={onClick}>
    <Img />
    <Txt>New chat</Txt>
  </Container>;
