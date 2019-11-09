import React, { useContext, useEffect } from 'react'
import { UserContext } from "../contexts/UserContext";
import styled from 'styled-components';
import { Navbar } from "../components/Navbar";
import { Transactions } from "./Transactions";
import { Cards } from "./Cards";
import useInterval from "react-useinterval";
import Lottie from "react-lottie";
import business from "../assets/lottie/business.json";

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
  const { screen, loadLastTransactions } = useContext(UserContext);

  useInterval(() => {
    loadLastTransactions();
  }, 60000);

  if (screen === 'main/transactions')
    return <Transactions />;

  if (screen === 'main/cards')
    return <Cards />;

  return <Placeholder>Screen not found</Placeholder>
};

export const Main = () => {
  const { wallet, cards, transactions, loadWallet, loadCards, loadAllTransactions, loadLastTransactions, loadTotalBalance } = useContext(UserContext);

  useEffect(() => {
    loadWallet();
    loadCards();
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
