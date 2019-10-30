import React, { ReactNode, useCallback, useState } from 'react'
import { ICard, IQuote, ITransaction, IUser, IVerificationOption, IWallet, rApi, routes } from "../api";
import qs from 'qs';
import { sign } from "../util";
import getSymbolFromCurrency from 'currency-symbol-map'
import moment from "moment";

interface IStoreUserContext {
  screen: string
  setScreen: (screen: string, save?: boolean) => void
  loginChannel: IVerificationOption['channel'] | null
  setLoginChannel: (loginChannel: IVerificationOption['channel']) => void
  verificationOptions: IVerificationOption[] | null
  setVerificationOptions: (verificationOptions: IVerificationOption[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  phone: string
  setPhone: (phone: string) => void
  user: IUser | null
  setUser: (user: IUser) => void
  accessToken: string | null
  setAccessToken: (accessToken: string) => void
  wallet: IWallet | null
  setWallet: (wallet: IWallet) => void
  transactions: ITransaction[]
  setTransactions: (transactions: ITransaction[]) => void
  cards: ICard[]
  setCards: (card: ICard[]) => void
  loadWallet: () => void
  loadTotalBalance: () => void
  totalBalance: number
  loadTransactions: () => void
  loadAllTransactions: () => void
  unified: boolean
  setUnified: (unified: boolean) => void
  loadCards: () => void
}

export const UserContext = React.createContext<IStoreUserContext>({} as any);

export const UserContextProvider = (props: { children: ReactNode }) => {
  const initialScreen = localStorage.getItem('screen');
  const initialAccessToken = localStorage.getItem('accessToken');
  const initialUnified = localStorage.getItem('unified') === 'true';

  const [screen, setScreen] = useState(initialScreen || 'login');
  const [loginChannel, setLoginChannel] = useState<IVerificationOption['channel'] | null>(null);
  const [verificationOptions, setVerificationOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(initialAccessToken || null);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [unified, setUnified] = useState<boolean>(initialUnified);

  const setScreenLocal = (screen: string, save = true) => {
    if (save) localStorage.setItem('screen', screen);
    setScreen(screen);
  };

  const setUnifiedLocal = (unified: boolean) => {
    localStorage.setItem('unified', unified.toString());
    setUnified(unified);
  };

  const loadWallet = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.wallet);
    } catch (e) {
      setLoading(false);
      return console.error(e);
    }

    console.log({ wallet: res.data });
    setWallet(res.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCards = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.myCards);
    } catch (e) {
      return console.error(e);
    }

    console.log({ cards: res.data });
    setCards(res.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTotalBalance = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.quote, {
        params: { symbol: wallet!.pockets.map(p => p.currency + wallet!.baseCurrency) },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });
    } catch (e) {
      setLoading(false);
      return console.error(e);
    }

    const quotes = res.data as IQuote[];
    console.log({ quotes });
    let totalBalance = wallet!.pockets.find(p => p.currency === wallet!.baseCurrency)!.balance;
    for (const pocket of wallet!.pockets.filter(p => p.currency !== wallet!.baseCurrency)) {
      const quote = quotes.find(q => q.from === pocket.currency)!;
      totalBalance += pocket.balance * quote.rate;
    }
    console.log({ totalBalance, baseCurrency: wallet!.baseCurrency });
    setTotalBalance(totalBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const loadTransactions = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.transactionsLast);
    } catch (e) {
      return console.error(e);
    }

    console.log({ lastTransactions: res.data });
    const transactionToAdd = [] as ITransaction[];
    for (const transaction of res.data as ITransaction[]) {
      if (!transactions.find(t => t.id === transaction.id)) {
        transactionToAdd.push(transaction);
        if (transaction.account.type === 'CURRENT') {
          const { amount, currency, description, merchant } = transaction;
          console.log({ transaction });
          new Notification(merchant ? merchant.name : description, {
            body: `${sign(amount)}${getSymbolFromCurrency(currency)}${Math.abs(amount) / 100}`
          })
        }
      }
    }
    if (transactionToAdd.length > 0) {
      await loadWallet();
    }
    setTransactions([...transactionToAdd, ...transactions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTransactions, transactions]);

  const loadAllTransactions = useCallback(async () => {
    let tmpTransactions = [] as ITransaction[];

    try {
      let res;
      let next = +moment();
      do {
        res = await rApi(routes.transactionsLastTo(next));
        console.log({ to: next, transactions: res.data });
        if (res.data.length) {
          next = res.data[res.data.length - 1].startedDate;
        }
        tmpTransactions = [...tmpTransactions, ...res.data];
        setTransactions(tmpTransactions);
      } while (res.data.length);
    } catch (e) {
      return console.error(e);
    }
  }, [setTransactions]);

  const value = React.useMemo(
    () => ({
      screen,
      setScreen: setScreenLocal,
      phone,
      setPhone,
      loginChannel,
      setLoginChannel,
      user,
      setUser,
      accessToken,
      setAccessToken,
      wallet,
      setWallet,
      transactions,
      setTransactions,
      loadWallet,
      loadTotalBalance,
      loading,
      setLoading,
      cards,
      setCards,
      loadTransactions,
      loadAllTransactions,
      verificationOptions,
      setVerificationOptions,
      totalBalance,
      setTotalBalance,
      unified,
      setUnified: setUnifiedLocal,
      loadCards
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      screen,
      phone,
      loginChannel,
      verificationOptions,
      user,
      accessToken,
      wallet,
      transactions,
      loading,
      cards,
      totalBalance,
      unified
    ],
  );

  // @ts-ignore
  return <UserContext.Provider value={value} {...props} />
};
