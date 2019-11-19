import moment from "moment";
import React, { useContext, useEffect } from "react";
import styled, { css } from "styled-components";
import { IChatHistory } from "../api";
import { UserContext } from "../contexts/UserContext";

const Container = styled.div<{ active: boolean }>`
	display: flex;
	padding: 1rem;
	width: 20rem;
	cursor: pointer;
	
	:hover {
	  background-color: #f4f5f5;
	}
	
	${props => props.active && css`
    background-color: #e9ebeb !important;
    cursor: default;
  `}
`;

const AgentAvatar = styled.img`
	width: 2.5rem;
	display: flex;
	flex-basis: 2.5rem;
	flex-shrink: 0;
	height: 2.5rem;
	border-radius: 50%;
	overflow: hidden;
	position: relative;
	
  :before {
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    width: 100%; 
    height: 100%;
    background-image: url(https://www.revolut.com/icons/icon-256x256.png);
    background-size: 2rem 2rem;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #fff;
  }
`;

const AgentNameMessage = styled.div`
  margin: 0 .75rem;
  display: flex;
  flex-direction: column;
`;

const AgentNameDate = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AgentName = styled.div`
  font-family: 'Roboto Medium', sans-serif;
  margin-bottom: .25rem;
`;

const Date = styled.div`
  color: #8b959e;
`;

const ChatText = styled.div`
	white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 16rem;
  color: #8b959e;
`;

const Dot = styled.div`
  background-color: #eb008d;
  border-radius: 50%;
  align-self: center;
  width: .5rem;
  height: .5rem;
  flex-shrink: 0;
`;

interface Props {
  active: boolean
  onClick: () => void
  chatHistory: IChatHistory
}

export const ChatPreview = ({ active, onClick, chatHistory }: Props) => {
  const { loadAgentInfo, loadAgentAvatar, agents } = useContext(UserContext);
  const agent = agents[chatHistory.assigned];

  useEffect(() => {
    if (!agent) {
      loadAgentInfo(chatHistory.assigned);
      loadAgentAvatar(chatHistory.assigned);
    }
    // eslint-disable-next-line
  }, []);


  return <Container active={active} onClick={onClick}>
    <AgentAvatar src={agent?.avatar} />
    <AgentNameMessage>
      <AgentNameDate>
        <AgentName>{agent?.name}</AgentName>
        <Date>{moment(chatHistory.updatedAt).format('MMM DD YYYY')}</Date>
      </AgentNameDate>
      <ChatText>{chatHistory.lastMessage?.payload.text}</ChatText>
    </AgentNameMessage>
    {!!chatHistory.unread && <Dot />}
  </Container>;
};

