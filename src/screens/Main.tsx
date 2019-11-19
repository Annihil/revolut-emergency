import React, { useContext, useEffect } from 'react'
import { UserContext } from "../contexts/UserContext";
import styled from 'styled-components';
import { Navbar } from "../components/Navbar";
import { Transactions } from "./Transactions";
import { Cards } from "./Cards";
import useInterval from "react-useinterval";
import Lottie from "react-lottie";
import business from "../assets/lottie/business.json";
import { Chats } from "./Chats";

const Container = styled.div`
	display: flex;
	flex-flow: column;
	flex: 1;
	height: 100%;
`;

const Placeholder = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	color: #8b959e;
	font-size: 2.5rem;
`;

const Screen = () => {
  const { screen, loadLastTransactions, loadUnreadChat } = useContext(UserContext);

  useInterval(() => {
    loadLastTransactions();
  }, 60000);

  useInterval(() => {
    loadUnreadChat();
  }, 10000);

  if (screen === 'main/transactions')
    return <Transactions />;

  if (screen === 'main/cards')
    return <Cards />;

  if (screen === 'main/chats')
    return <Chats />;

  return <Placeholder>Screen not found</Placeholder>
};

export const Main = () => {
  const { wallet, cards, transactions, loadWallet, loadCards, loadAllTransactions, loadLastTransactions, loadTotalBalance, connectChat, loadChatHistory } = useContext(UserContext);

  useEffect(() => {
    async function go() {
      loadWallet();
      loadCards();
      await connectChat();
      loadChatHistory();
    }

    go()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!wallet) return;
    loadTotalBalance();
    if (!transactions.length) {
      loadAllTransactions();
    } else {
      loadLastTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  if (!wallet || !cards.length || !transactions.length) {
    return <Container>
      <Lottie
        options={{
          animationData: business,
          rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
        }}
        // @ts-ignore
        style={{ margin: 'auto' }}
        height={600}
        width={600} />
    </Container>;
  }

  return <Container>
    <Navbar />
    <Screen />
  </Container>
};
