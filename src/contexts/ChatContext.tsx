import React, { ReactNode, useCallback, useState } from 'react'
import { chatApi, chatRoutes, IAgent, IChatHistory, IMessage, rApi } from "../api";

const { remote } = window.require('electron');

interface IChatContext {
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

export const ChatContext = React.createContext<IChatContext>({} as IChatContext);

export const ChatContextProvider = (props: { children: ReactNode }) => {
  const [chatsHistory, setChatsHistory] = useState<IChatHistory[]>([]);
  const [agents, setAgents] = useState<{ [key: string]: IAgent }>({});
  const [uploads, setUploads] = useState<{ [key: string]: string }>({});
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: IMessage[] }>({});
  const [openTickets, setOpenTickets] = useState<IChatHistory[]>([]);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);

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

  const value = React.useMemo(
    () => ({
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

  return <ChatContext.Provider value={value} {...props} />
};
