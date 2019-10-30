import React, { useEffect, useState } from 'react';
import { amountFmt, sign } from "../util";
import getSymbolFromCurrency from 'currency-symbol-map'
import moment from "moment";
import styled, { css } from "styled-components";
import cash from "../assets/tag/cash.svg";
import entertainment from "../assets/tag/entertainment.svg";
import general from "../assets/tag/general.svg";
import groceries from "../assets/tag/groceries.svg";
import health from "../assets/tag/health.svg";
import restaurants from "../assets/tag/restaurants.svg";
import services from "../assets/tag/services.svg";
import shopping from "../assets/tag/shopping.svg";
import transport from "../assets/tag/transport.svg";
import travel from "../assets/tag/travel.svg";
import utilities from "../assets/tag/utilities.svg";
import exchange from "../assets/type/exchange.svg";
import refund from "../assets/type/refund.svg";
import reward from "../assets/type/reward.svg";
import topup from "../assets/type/topup.svg";
import declined from "../assets/declined.svg";
import bank from "../assets/bank.svg";
import pending from "../assets/transfer_pending.svg";
import transferIn from "../assets/transfer_in.svg";
import transferOut from "../assets/transfer_out.svg";
import transferRecurring from "../assets/transfer_recurring.svg";
import vaultCashbash from "../assets/vault_cashback_circle.svg";
import { Spacer } from "./Spacer";
import { ITransaction, loadUserImage } from "../api";
import { useDelay } from "../hooks/useDelay";

const tags = {
  cash,
  entertainment,
  general,
  groceries,
  health,
  restaurants,
  services,
  shopping,
  transfers: bank,
  transport,
  travel,
  utilities
};

const types = {
  EXCHANGE: exchange,
  REFUND: refund,
  CARD_REFUND: refund,
  REWARD: reward,
  TOPUP: topup,
  FEE: general,
  TRANSFER: bank
};

const StyledTransaction = styled.div`
  margin: 2rem;
`;

const StyledInner = styled.div`
  display: flex;
  flex-direction: row;
`;

const LogoContainer = styled.div`
	position: relative;
	width: 2.5rem;
	height: 2.5rem;
	display: inline-flex;
`;

const Logo = styled.img`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
`;

const LogoLetters = styled.div`
  width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	background-color: #7986CB;
	font-size: .92rem;
	text-transform: uppercase;
`;

const State = styled.img`
	position: absolute;
	bottom: 0;
	right: 0;
	width: 14px;
	height: 14px;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  flex: 1;
`;

const Description = styled.span<Pick<ITransaction, 'state'>>`
	font-family: 'Roboto Medium', sans-serif;
	${props => props.state.match(/REVERTED|DECLINED|FAILED/) && css`
		color: #8b959e;
	`}
`;

const Amount = styled.span<Pick<ITransaction, 'state'>>`
  white-space: nowrap;
  margin-left: .5rem;
	${props => props.state.match(/REVERTED|DECLINED|FAILED/) && css`
		text-decoration: line-through;
	`}
`;

const Time = styled.span`
	color: #cfd8dc;
`;

const ExchangedAmount = styled.span`
  white-space: nowrap;
  margin-left: .5rem;
  color: #cfd8dc;
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const TransactionDelayed = (props: ITransaction & { i: number, onClick?: () => void }) => {
  const ready = useDelay(props.i);
  if (!ready) return null;
  return <Transaction onClick={() => console.log(props)} {...props} />;
};

const UserLogo = ({ user }: { user: { id: string, firstName?: string, lastName?: string } }) => {
  const [img, setImg] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      setImg(await loadUserImage(user.id));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!img) return <LogoLetters>{user.firstName!.charAt(0)}{user.lastName!.charAt(0)}</LogoLetters>;
  return <Logo src={img} />;
};

const isUser = (recipient: ITransaction['recipient'], sender: ITransaction['sender']) =>
  (recipient && recipient.firstName) || (sender && sender.firstName);

const Transaction = ({ merchant, description, amount, currency, counterpart, type, startedDate, tag, state, standingOrder, sender, recipient, cashbackBoxId, ...rest }: ITransaction & { onClick?: () => void }) =>
  <StyledTransaction onClick={rest.onClick}>
    <StyledInner>
      <LogoContainer>
        {state.match(/REVERTED|DECLINED|FAILED/) && <Logo src={declined} />}
        {!state.match(/REVERTED|DECLINED|FAILED/) && <>
          {merchant && <Logo src={merchant.logo || tags[tag]} onError={() => merchant.logo = tags[tag]} />}
          {!merchant && !isUser(recipient, sender) && !cashbackBoxId &&
					<Logo src={tag !== 'general' ? tags[tag] : types[type]} />}
          {isUser(recipient, sender) && <UserLogo user={sender || recipient} />}
          {cashbackBoxId && <Logo src={vaultCashbash} />}
				</>}
        {state === 'PENDING' && <State src={pending} />}
        {state === 'COMPLETED' && type === 'TRANSFER' && amount > 0 && <State src={transferIn} />}
        {state === 'COMPLETED' && type === 'TRANSFER' && amount < 0 && <State src={transferOut} />}
        {state === 'COMPLETED' && type === 'TRANSFER' && standingOrder && <State src={transferRecurring} />}
      </LogoContainer>
      <Texts>
        <Row>
          <Description state={state}>{merchant ? merchant.name : description}</Description>
          <Amount state={state}>{sign(amount)}{getSymbolFromCurrency(currency)}{amountFmt(amount)}</Amount>
        </Row>
        <Spacer height='.25rem' />
        <Row>
          <Time>
            {moment(startedDate).format('MMM DD, HH:mm, YYYY')}
            {state === 'REVERTED' && ', reverted'}
            {state.match(/DECLINED|FAILED/) && ', declined'}
            {state === 'PENDING' && ', pending'}
          </Time>
          {counterpart && counterpart.currency !== currency &&
					<ExchangedAmount>{sign(counterpart.amount)}{getSymbolFromCurrency(counterpart.currency)}{amountFmt(counterpart.amount)}</ExchangedAmount>}
        </Row>
      </Texts>
    </StyledInner>
  </StyledTransaction>;
