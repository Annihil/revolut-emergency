import React, { useContext, useEffect } from 'react'
import styled from 'styled-components';
import snowflake from '../assets/card/snowflake.svg';
import { Card } from "../components/Card";
import { CardContext } from "../contexts/CardContext";


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-flow: row wrap;
  flex: 1;
  overflow-y: scroll;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column;
`;

const StyledAction = styled.div`
  display: flex;
  cursor: pointer;
  margin-bottom: 2rem;
`;

const ActionIcon = styled.img`
  width: 1.75rem;
  background-color: #0074eb;
  padding: .5rem;
  border-radius: 50%;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex: 1;
  flex-flow: column;
  margin: 0 1rem;
`;

const Title = styled.div`
  font-family: 'Roboto Medium', sans-serif;
  color: #0074eb;
`;

const Subtitle = styled.div`
  color: #89969e;
`;

export const Cards = () => {
  const { cards, blockCard, loadCards } = useContext(CardContext);

  useEffect(() => {
    loadCards();
  }, []);

  if (!cards.length) return null;

  return <Container>
    {cards.map(c => <CardContainer key={c.id}>
      <Card {...c} />
      {c.state === 'ACTIVE' && <StyledAction onClick={() => blockCard(c)}>
        <ActionIcon src={snowflake} />
        <TextContainer>
          <Title>Freeze card</Title>
          <Subtitle>Use app to unfreeze</Subtitle>
        </TextContainer>
      </StyledAction>}
    </CardContainer>)}
  </Container>
};
