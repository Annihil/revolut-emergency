import React, { useContext } from 'react'
import styled, { css } from 'styled-components';

import card from '../assets/nav/card_grey.svg';
import wallet from '../assets/nav/wallet_grey.svg';
import chat from '../assets/nav/chat_grey.svg';
import cardBlue from '../assets/nav/card_blue.svg';
import walletBlue from '../assets/nav/wallet_blue.svg';
import chatBlue from '../assets/nav/chat_blue.svg';
import logoutIcon from '../assets/nav/logout.svg';
import { rApi, routes } from "../api";
import { ChatContext } from "../contexts/ChatContext";
import { NavContext } from "../contexts/NavContext";

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	box-shadow: 0 0 9px 0 rgba(168, 168, 168, .3);
	-webkit-app-region: drag;
`;

const Item = styled.div<{ active?: boolean }>`
  position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column;
	padding: .25rem;
  cursor: pointer;
  -webkit-app-region: no-drag;
	
	${props => props.active && css`
		cursor: default;
	`}
`;

const Label = styled.div`
	font-size: .85rem;
`;

const Img = styled.img`
	width: 1.5rem;
	height: 1.5rem;
`;

const Dot = styled.div`
  position: absolute;
  top: .25rem;
  right: .25rem;
  background-color: #eb008d;
  border-radius: 50%;
  align-self: center;
  width: .5rem;
  height: .5rem;
  flex-shrink: 0;
`;

const items = [
  { label: 'Accounts', img: wallet, imgOn: walletBlue, screen: 'main/transactions' },
  { label: 'Cards', img: card, imgOn: cardBlue, screen: 'main/cards' },
  { label: 'Chat', img: chat, imgOn: chatBlue, screen: 'main/chats' },
];

export const Navbar = () => {
  const { screen, setScreen } = useContext(NavContext);
  const { unread } = useContext(ChatContext);

  const logout = async () => {
    try {
      await rApi.post(routes.logout);
    } catch (e) {
      return console.error(e.response);
    }

    localStorage.clear();
    window.location.reload();
  };

  return <Container>
    {items.map(item => <Item key={item.label} onClick={() => setScreen(item.screen)} active={screen === item.screen}>
      <Img src={screen === item.screen ? item.imgOn : item.img} />
      <Label>{item.label}</Label>
      {item.label === 'Chat' && unread > 0 && <Dot />}
    </Item>)}
    <Item key='logout' onClick={logout}>
      <Img src={logoutIcon} />
      <Label>Logout</Label>
    </Item>
  </Container>
};
