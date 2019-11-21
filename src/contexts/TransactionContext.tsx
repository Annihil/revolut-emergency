import React, { ReactNode, useCallback, useState } from 'react'
import { IQuote, ITransaction, IWallet, rApi, routes } from "../api";
import qs from 'qs';
import { sign } from "../util";
import getSymbolFromCurrency from 'currency-symbol-map'
import moment from "moment";

interface ITransactionContext {
  wallet: IWallet | null
  setWallet: (wallet: IWallet) => void
  transactions: ITransaction[]
  setTransactions: (transactions: ITransaction[]) => void
  loadWallet: () => void
  loadTotalBalance: () => void
  totalBalance: number
  loadLastTransactions: () => void
  loadAllTransactions: () => void
  unified: boolean
  setUnified: (unified: boolean) => void
}

export const TransactionContext = React.createContext<ITransactionContext>({} as ITransactionContext);

export const TransactionContextProvider = (props: { children: ReactNode }) => {
  const initialUnified = localStorage.getItem('unified') === 'true';
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [unified, setUnified] = useState<boolean>(initialUnified);

  const setUnifiedLocal = (unified: boolean) => {
    localStorage.setItem('unified', unified.toString());
    setUnified(unified);
  };

  const loadWallet = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.wallet);
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ wallet: res.data });
    setWallet(res.data);
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
      return console.error(e.response);
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

  const loadLastTransactions = useCallback(async () => {
    let res = null as { data: ITransaction[] } | null;
    try {
      res = await rApi(routes.transactionsLast) as { data: ITransaction[] } | null;
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ lastTransactions: res!.data });
    setTransactions(prevTransactions => {
      const transactionToAdd = [] as ITransaction[];
      for (const transaction of res!.data) {
        if (!prevTransactions.find(t => t.id === transaction.id)) {
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
        loadWallet();
      }
      return [...transactionToAdd, ...prevTransactions]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTransactions]);

  const loadAllTransactions = useCallback(async () => {
    try {
      let res = null as { data: ITransaction[] } | null;
      let next = +moment();
      do {
        try {
          res = (await rApi(routes.transactionsLastTo(next))) as { data: ITransaction[] } | null;
          console.log({ to: next, transactions: res!.data });
          if (res!.data.length) {
            next = res!.data[res!.data.length - 1].startedDate;
          }
          // eslint-disable-next-line no-loop-func
          setTransactions(prevTransactions => [...prevTransactions, ...res!.data]);
        } catch (e) {
          console.warn(e)
        }
      } while (res && res.data.length);
    } catch (e) {
      return console.error(e.response);
    }
  }, [setTransactions]);

  const value = React.useMemo(
    () => ({
      wallet,
      setWallet,
      transactions,
      setTransactions,
      loadWallet,
      loadTotalBalance,
      loadLastTransactions,
      loadAllTransactions,
      totalBalance,
      setTotalBalance,
      unified,
      setUnified: setUnifiedLocal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      wallet,
      transactions,
      totalBalance,
      unified,
    ],
  );

  return <TransactionContext.Provider value={value} {...props} />
};
