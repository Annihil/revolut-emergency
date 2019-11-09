import React, { useContext } from 'react'
import { UserContext } from "../contexts/UserContext";
import styled, { css } from 'styled-components';

import card from '../assets/card_grey.svg';
import wallet from '../assets/wallet_grey.svg';
import cardBlue from '../assets/card_blue.svg';
import walletBlue from '../assets/wallet_blue.svg';
import logoutIcon from '../assets/logout.svg';
import { rApi, routes } from "../api";

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	box-shadow: 0 0 9px 0 rgba(168, 168, 168, .3);
	-webkit-app-region: drag;
`;

const Item = styled.div<{ active?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column;
	padding: .25rem;
	cursor: pointer;
	
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

const items = [
  { label: 'Accounts', img: wallet, imgOn: walletBlue, screen: 'main/transactions' },
  { label: 'Cards', img: card, imgOn: cardBlue, screen: 'main/cards' },
];

export const Navbar = () => {
  const { screen, setScreen } = useContext(UserContext);

  const logout = async () => {
    try {
      await rApi.post(routes.logout);
    } catch (e) {
      return console.error(e);
    }

    localStorage.clear();
    window.location.reload();
  };

  return <Container>
    {items.map(item => <Item key={item.label} onClick={() => setScreen(item.screen)} active={screen === item.screen}>
      <Img src={screen === item.screen ? item.imgOn : item.img} />
      <Label>{item.label}</Label>
    </Item>)}
    <Item key='logout' onClick={logout}>
      <Img src={logoutIcon} />
      <Label>Logout</Label>
    </Item>
  </Container>
};
