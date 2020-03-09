import React, { useContext, useEffect } from 'react'
import { TransactionContext } from "../contexts/TransactionContext";
import styled from 'styled-components';
import { Navbar } from "../components/Navbar";
import { Transactions } from "./Transactions";
import { Cards } from "./Cards";
import useInterval from "react-useinterval";
import Lottie from "react-lottie";
import business from "../assets/lottie/business.json";
import { Chats } from "./Chats";
import { NavContext } from "../contexts/NavContext";
import { CardContext } from "../contexts/CardContext";
import { ChatContext } from "../contexts/ChatContext";

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
  const { screen } = useContext(NavContext);
  const { loadLastTransactions } = useContext(TransactionContext);
  const { loadUnreadChat } = useContext(ChatContext);

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
  const { wallet, transactions, loadWallet, loadAllTransactions, loadLastTransactions, loadTotalBalance } = useContext(TransactionContext);
  const { cards, loadCards, } = useContext(CardContext);
  const { connectChat, loadChatHistory } = useContext(ChatContext);

  useEffect(() => {
    async function go() {
      if (!wallet) loadWallet();
      loadCards();
      await connectChat();
      loadChatHistory();
    }

    go()
  }, []);

  useEffect(() => {
    if (!wallet) return;
    loadTotalBalance();
    if (!transactions.length) {
      loadAllTransactions();
    } else {
      loadLastTransactions();
    }
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
