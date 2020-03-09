import axios from 'axios';
import { PeerCertificate } from "tls";

const { machineIdSync } = window.require('node-machine-id');

const mId = machineIdSync({ original: true });

export interface ITransaction {
  id: string
  legId: string
  account: {
    id: string
    type: 'ACTIVE' | 'CURRENT'
  }
  amount: number
  currency: string
  description: string
  merchant: {
    name: string
    logo: string
  }
  state: 'PENDING' | 'COMPLETED' | 'REVERTED' | 'DECLINED' | 'FAILED'
  counterpart: {
    currency: string
    amount: number
  }
  type: 'EXCHANGE' | 'REFUND' | 'CARD_REFUND' | 'REWARD' | 'TOPUP' | 'FEE' | 'TRANSFER'
  tag: 'cash' | 'entertainment' | 'general' | 'groceries' | 'health' | 'restaurants' | 'services' | 'shopping' | 'transfers' | 'transport' | 'travel' | 'utilities'
  startedDate: number
  standingOrder: object | null
  sender: {
    id: string
    firstName?: string
    lastName?: string
  }
  recipient: {
    id: string
    firstName?: string
    lastName?: string
  },
  cashbackBoxId: string
}

export interface ICard {
  id: string
  state: 'NONE' | 'ACTIVE' | 'BLOCKED' | 'LOST' | 'EXPIRED' | 'LOCKED' | 'COMPROMISED' | 'TERMINATED' | 'DELETED' | 'ORDERED' | 'CREATED'
  expiryDate: string
  lastFour: string
  brand: 'VISA' | 'MASTERCARD'
  design: 'ORIGINAL' | 'COPPER' | 'COPPER_BLACK' | 'ROSE_GOLD' | 'ROSE_GOLD_BLACK' | 'SILVER' | 'BLACK_SILVER' | 'SPACE_GREY' | 'METAL' | 'PRIDE' | 'ROSE_GOLD_METAL' | 'SILVER_METAL' | 'SPACE_GREY_METAL' | 'GOLD_METAL' | 'GOLD_PLASTIC' | 'YOUTH_ORIGINAL' | 'EZYLET' | 'PRIMETEL' | 'BOOKING' | 'HELLAS_DIRECT' | 'ORIGINAL_VIRTUAL' | 'ORIGINAL_DISPOSABLE'
  disposable: boolean
  virtual: boolean
  label: string
}

export interface IWallet {
  baseCurrency: string,
  pockets: [{
    id: string
    balance: number
    state: string
    type: string
    currency: string
  }]
}

export interface IQuote {
  from: string,
  to: string,
  rate: number,
  timestamp: number
}

export interface IVerificationOption {
  channel: 'SMS' | 'EMAIL' | 'CALL'
  value: string
}

export interface IAgent {
  id: string
  name: string
  avatar: string
}

export interface IChatHistory {
  assigned: string
  bot: boolean
  createdAt: string
  id: string
  language: string
  lastMessage: {
    author: {
      id: string
      name: string
    }
    createdAt: string
    fromClient: false
    id: string
    payload: {
      text?: string
      type: 'text'
    }
  } | undefined
  payloadType: 'message'
  readOnly: boolean
  state: 'ClosedAndRated'
  unread: number
  updatedAt: string
}

export interface PayloadText {
  type: 'text'
  text: string
}

export interface PayloadUpload {
  type: 'upload'
  mediaType: 'image/jpeg' | 'application/pdf' | 'image/png'
  uploadId: string
}

interface PayloadRated {
  type: 'rated'
  rating: number
}

interface PayloadAssigned {
  type: 'assigned'
  assigned: {
    agentId: string
    agentName: string
  }
  assignedBy: string
  inboxId: string
}

interface PayloadInitialized {
  type: 'initialized'
  inboxId: string
  initializedBy: string
}

interface PayloadClosed {
  type: 'closed'
  closedBy: string
}

interface PayloadEscalated {
  type: 'escalated'
  agentId: string
  inboxId: string
  queue: string
  routeId: string
}

interface PayloadResolved {
  type: 'resolved'
  agentId: string
}

export interface IMessage {
  id: string,
  messageId: string,
  createdAt: string,
  updatedAt: string,
  ticketId: string,
  fromClient: false,
  authorId: string,
  author: {
    id: string,
    name: string
  },
  payload: PayloadText | PayloadUpload | PayloadRated | PayloadAssigned | PayloadInitialized | PayloadClosed | PayloadEscalated | PayloadResolved
  payloadType: 'message' | 'service',
  clientMessageId?: string,
  correlationId?: string
}


export const routes = {
  login: '/signin',
  loginConfirm: '/signin/confirm',
  loginBiometric: `/biometric-signin/selfie`,
  loginBiometricConfirm: (id: string) => `/biometric-signin/confirm/${id}`,
  verificationOptions: (phone: string) => `/verification/options?phone=${encodeURIComponent(phone)}`,
  verificationCodeResend: '/verification-code/resend',
  verificationCodeCall: '/verification-code/call',
  logout: '/signout',
  wallet: '/user/current/wallet',
  quote: '/quote',
  transactionsLast: '/user/current/transactions/last',
  transactionsLastTo: (to: number) => `/user/current/transactions/last?to=${to}`,
  myCards: '/my-card/all',
  myCardBlock: (cardId: string) => `/my-card/${cardId}/block`
};

export const chatRoutes = {
  connect: '/signin/revolut',
  history: '/tickets/history',
  agentInfo: (agentId: string) => `/agents/${agentId}/info`,
  agentAvatar: (agentId: string) => `/agents/${agentId}/avatar`,
  ticket: '/tickets',
  ticketMessage: (ticketId: string) => `/tickets/${ticketId}/messages/history`,
  ticketRate: (ticketId: string) => `/tickets/${ticketId}/rate`,
  ticketText: (ticketId: string) => `/tickets/${ticketId}/messages/text`,
  ticketUpload: (ticketId: string) => `/tickets/${ticketId}/messages/upload`,
  ticketRead: (ticketId: string) => `/tickets/${ticketId}/messages/read`,
  summary: '/tickets/summary',
  uploads: (uploadId: string) => `/uploads/${uploadId}`
};

const headers = {
  'x-client-version': '6.30',
  'x-device-id': mId,
};
const adapter = window.require('axios/lib/adapters/http');

const fingerprint = '72:D6:89:C7:C6:DF:4B:A8:D7:D6:22:50:83:4D:20:02:BB:0E:61:6E';
export const rApi = axios.create({
  baseURL: 'https://api.revolut.com',
  headers: {
    ...headers,
    'x-api-version': '1',
    'user-agent': 'Revolut (iPhone)',
  },
  // https://github.com/axios/axios/pull/2498
  // @ts-ignore
  checkServerIdentity: (host, cert: PeerCertificate) => {
    if (cert.fingerprint !== fingerprint) {
      const msg = `Certificate verification error: The certificate of '${cert.subject.CN}' ` +
        'does not match the pinned fingerprint';
      console.error(msg);
      return new Error(msg);
    }
  },
  adapter
});

export const chatApi = axios.create({
  baseURL: 'https://chat.revolut.com/api/client',
  headers: {
    ...headers,
    'x-chat-version': '3.0',
    'user-agent': 'Chat/3.0',
  },
  adapter
});

const imageCache = {} as { [key: string]: string };
export const loadUserImage = async (userId: string) => {
  if (userId in imageCache) {
    return imageCache[userId];
  }

  let res;
  try {
    res = await rApi(`/user/${userId}/picture`, { responseType: 'arraybuffer' });
  } catch (err) {
    return undefined;
  }

  const image = Buffer.from(res.data, 'binary').toString('base64');
  const src = `data:${res.headers['content-type'].toLowerCase()};base64,${image}`;
  imageCache[userId] = src;
  return src;
};

rApi.interceptors.response.use(r => r, error => {
  if (error.response.status === 401) {
    if (localStorage.getItem('id') && localStorage.getItem('accessToken')) {
      localStorage.clear();
      window.location.reload();
    }
  }
  return Promise.reject(error);
});

const id = localStorage.getItem('id') as string | null;
const accessToken = localStorage.getItem('accessToken') as string | null;
if (id && accessToken) {
  rApi.defaults.auth = { username: id, password: accessToken };
}
