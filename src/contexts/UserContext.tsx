import React, { ReactNode, useCallback, useState } from 'react'
import {
  chatApi,
  chatRoutes,
  IAgent,
  ICard,
  IChatHistory,
  IMessage,
  IQuote,
  ITransaction,
  IVerificationOption,
  IWallet,
  rApi,
  routes
} from "../api";
import qs from 'qs';
import { sign } from "../util";
import getSymbolFromCurrency from 'currency-symbol-map'
import moment from "moment";

const { remote } = window.require('electron');

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
  wallet: IWallet | null
  setWallet: (wallet: IWallet) => void
  transactions: ITransaction[]
  setTransactions: (transactions: ITransaction[]) => void
  cards: ICard[]
  setCards: (card: ICard[]) => void
  loadWallet: () => void
  loadTotalBalance: () => void
  totalBalance: number
  loadLastTransactions: () => void
  loadAllTransactions: () => void
  unified: boolean
  setUnified: (unified: boolean) => void
  loadCards: () => void
  connectChat: () => void
  loadChatHistory: () => void
  chatsHistory: IChatHistory[]
  setChatsHistory: (chatsHistory: IChatHistory[]) => void
  agents: { [key: string]: IAgent }
  loadAgentInfo: (agentId: string) => void
  loadAgentAvatar: (agentId: string) => void
  uploads: { [key: string]: string }
  currentChat: string | null
  setCurrentChat: (currentChat: string | null) => void
  messages: { [key: string]: IMessage[] }
  setMessages: (messages: { [key: string]: IMessage[] }) => void
  loadMessages: (ticketId: string) => void
  openTicket: () => void
  openTickets: IChatHistory[]
  text: string
  setText: (text: string) => void
  sendText: () => void
  sendAttachment: (formData: any) => void
  loadUnreadChat: () => void
  readChat: () => void
  loadUpload: (uploadId: string) => void
  unread: number
  setUnread: (unread: number) => void
  rateTicket: (rating: number) => void
}

export const UserContext = React.createContext<IStoreUserContext>({} as IStoreUserContext);

export const UserContextProvider = (props: { children: ReactNode }) => {
  const initialScreen = localStorage.getItem('screen');
  const initialUnified = localStorage.getItem('unified') === 'true';

  const [screen, setScreen] = useState<string>(initialScreen || 'login');
  const [loginChannel, setLoginChannel] = useState<IVerificationOption['channel'] | null>(null);
  const [verificationOptions, setVerificationOptions] = useState<IVerificationOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [unified, setUnified] = useState<boolean>(initialUnified);
  const [chatsHistory, setChatsHistory] = useState<IChatHistory[]>([]);
  const [agents, setAgents] = useState<{ [key: string]: IAgent }>({});
  const [uploads, setUploads] = useState<{ [key: string]: string }>({});
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: IMessage[] }>({});
  const [openTickets, setOpenTickets] = useState<IChatHistory[]>([]);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);

  const setScreenLocal = (screen: string, save = true) => {
    if (save) localStorage.setItem('screen', screen);
    setScreen(screen);
  };

  const setUnifiedLocal = (unified: boolean) => {
    localStorage.setItem('unified', unified.toString());
    setUnified(unified);
  };

  const connectChat = useCallback(async () => {
    let res;
    try {
      res = await chatApi.post(chatRoutes.connect, {
        clientId: rApi.defaults.auth?.username,
        accessToken: rApi.defaults.auth?.password
      });
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ chatCredentials: res.data });
    chatApi.defaults.headers.authorization = `Bearer ${res.data.accessToken}`;

    loadUnreadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUnreadChat = useCallback(async () => {
    let res;
    try {
      res = await chatApi(chatRoutes.summary) as null | { data: { unread: number } };
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ summary: res?.data });

    remote.app.badgeCount = res?.data.unread!;
    setUnread(res?.data.unread!);

    if (res?.data.unread! > 0) {
      await getTickets();
      await loadMessages(currentChat!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat]);

  const readChat = useCallback(async () => {
    try {
      await chatApi.post(chatRoutes.ticketRead(currentChat!));
    } catch (e) {
      return console.error(e.response);
    }

    console.log('read chat', currentChat);

    await getTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat]);

  const openTicket = useCallback(async () => {
    let res;
    try {
      res = await chatApi.post(chatRoutes.ticket) as null | { data: { id: string } };
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ newTicket: res?.data });

    await getTickets();

    setCurrentChat(res!.data.id);
    // eslint-disable-next-line
  }, []);

  const rateTicket = useCallback(async (rating: number) => {
    try {
      await chatApi.post(chatRoutes.ticketRate(currentChat!), { rating });
    } catch (e) {
      return console.error(e.response);
    }

    console.log('rated ticket', rating);

    await loadChatHistory();
    await getTickets();
    await loadMessages(currentChat!);
    // eslint-disable-next-line
  }, [currentChat]);

  const getTickets = useCallback(async () => {
    let res;
    try {
      res = await chatApi(chatRoutes.ticket);
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ tickets: res.data });

    setOpenTickets(res.data);
    return res.data;
  }, []);

  const sendText = useCallback(async () => {
    let res;
    try {
      res = await chatApi.post(chatRoutes.ticketText(currentChat!), { text }) as { data: IMessage };
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ sentText: res.data });
    setText('');
    loadMessages(currentChat!);
    // eslint-disable-next-line
  }, [text, currentChat]);

  const sendAttachment = useCallback(async (formData) => {
    let res;
    try {
      res = await chatApi.post(
        chatRoutes.ticketUpload(currentChat!),
        formData,
        { headers: formData.getHeaders() }
      ) as { data: IMessage };
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ sentAttachment: res.data });
    loadMessages(currentChat!);
    // eslint-disable-next-line
  }, [currentChat]);

  const loadChatHistory = useCallback(async () => {
    let res;
    try {
      res = await chatApi(chatRoutes.history) as { data: IChatHistory[] };
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ chatsHistory: res.data });
    setChatsHistory(res.data);

    await getTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAgentInfo = useCallback(async (agentId: string) => {
    let res = null as null | { data: IAgent };
    try {
      res = await chatApi(chatRoutes.agentInfo(agentId));
    } catch (e) {
      console.error(e.response);
    }
    console.log({ agentInfo: res });
    setAgents(prevAgents => ({
      ...prevAgents,
      [agentId]: { ...prevAgents[agentId], ...res?.data! }
    }));
  }, []);

  const loadAgentAvatar = useCallback(async (agentId: string) => {
    let res = null as null | { headers: { location: string } };
    try {
      res = await chatApi(chatRoutes.agentAvatar(agentId), {
        maxRedirects: 0,
        validateStatus: status => status < 400
      });
    } catch (e) {
      console.error(e.response);
    }
    console.log({ agentAvatar: res });
    setAgents(prevAgents => ({
      ...prevAgents,
      [agentId]: { ...prevAgents[agentId], avatar: res?.headers.location! }
    }));
  }, []);

  const loadUpload = useCallback(async (uploadId: string) => {
    let res = null as null | { headers: { location: string } };
    try {
      res = await chatApi(chatRoutes.uploads(uploadId), {
        maxRedirects: 0,
        validateStatus: status => status < 400
      });
    } catch (e) {
      console.error(e.response);
    }
    setUploads(prevUploads => ({ ...prevUploads, [uploadId]: res?.headers.location! }));
    console.log({ uploadLocation: res });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = useCallback(async (ticketId: string) => {
    if (!ticketId) return;

    let res = null as null | { data: IMessage[] };
    try {
      res = await chatApi(chatRoutes.ticketMessage(ticketId));
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ messages: res.data });

    setMessages(prevMessages => ({
      ...prevMessages,
      [ticketId]: res!.data
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatsHistory]);

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

  const loadCards = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.myCards);
    } catch (e) {
      return console.error(e.response);
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
      screen,
      setScreen: setScreenLocal,
      phone,
      setPhone,
      loginChannel,
      setLoginChannel,
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
      loadLastTransactions,
      loadAllTransactions,
      verificationOptions,
      setVerificationOptions,
      totalBalance,
      setTotalBalance,
      unified,
      setUnified: setUnifiedLocal,
      loadCards,
      connectChat,
      loadChatHistory,
      chatsHistory,
      setChatsHistory,
      agents,
      loadAgentInfo,
      loadAgentAvatar,
      uploads,
      currentChat,
      setCurrentChat,
      messages,
      setMessages,
      loadMessages,
      openTicket,
      openTickets,
      text,
      setText,
      sendText,
      sendAttachment,
      loadUnreadChat,
      readChat,
      loadUpload,
      unread,
      setUnread,
      rateTicket
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      screen,
      phone,
      loginChannel,
      verificationOptions,
      wallet,
      transactions,
      loading,
      cards,
      totalBalance,
      unified,
      chatsHistory,
      agents,
      uploads,
      currentChat,
      messages,
      openTickets,
      text,
      unread
    ],
  );

  return <UserContext.Provider value={value} {...props} />
};
