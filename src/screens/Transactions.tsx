import React, { useContext } from 'react'
import { UserContext } from "../contexts/UserContext";
import styled, { css } from 'styled-components';
import { TransactionDelayed } from "../components/Transaction";
import getSymbolFromCurrency from 'currency-symbol-map'
import threeColumnsLayoutBlue from '../assets/nav/three_columns_layout_blue.svg';
import threeColumnsLayoutGrey from '../assets/nav/three_columns_layout_grey.svg';
import { amountFmt } from "../util";

const PocketScroller = css`
	display: flex;
	flex-flow: column;
	overflow-y: scroll;
	width: 100%;
`;

const Container = styled.div`
	display: flex;
	align-items: flex-start;
	flex: 1;
	height: 0;
	flex-flow: row nowrap;
	overflow-x: scroll;
	width: 100%;
	
	.pocket-scroller {
	  ${PocketScroller}
	}
`;

const Pocket = styled.div<{ large?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-flow: column;
	width: 25rem;
	height: 100%;
	margin: 0 auto;
	padding: 0 4rem;
	${props => props.large && css`
		width: 40rem;
	`}
`;

const Balance = styled.div`
	font-size: 2rem;
	margin: 1rem 0;
`;

const UnifyButton = styled.img`
   position: absolute;
   cursor: pointer;
   right: 1rem;
   top: 4rem;
   width: 1.5rem;
`;


export const Transactions = () => {
  const { wallet, transactions, totalBalance, unified, setUnified } = useContext(UserContext);

  if (!wallet || !transactions.length) return null;

  const pockets = wallet.pockets.filter(p => p.state === 'ACTIVE' && p.type === 'CURRENT');

  return <Container>
    <UnifyButton
      src={unified ? threeColumnsLayoutBlue : threeColumnsLayoutGrey}
      onClick={() => setUnified(!unified)}
    />
    {!unified && pockets.map(p => {
      const transactionsOfPocket = transactions.filter(t => t.account?.id === p.id);
      return <Pocket key={p.id}>
        <Balance>{getSymbolFromCurrency(p.currency)}{amountFmt(p.balance)}</Balance>
        <virtual-scroller class='pocket-scroller'>
          {transactionsOfPocket.map((t, i) => <TransactionDelayed i={i} {...t} key={t.legId} />)}
        </virtual-scroller>
      </Pocket>
    })}
    {unified && <Pocket large>
			<Balance>{getSymbolFromCurrency(wallet.baseCurrency)}{amountFmt(totalBalance)}</Balance>
			<virtual-scroller class='pocket-scroller'>
        {transactions.filter(t => t.account?.type === 'CURRENT').map((t, i) =>
          <TransactionDelayed i={i} {...t} key={t.legId} />)}
			</virtual-scroller>
		</Pocket>}
  </Container>
};
