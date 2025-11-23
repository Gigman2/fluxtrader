export enum SignalStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  CANCELLED = 'CANCELLED'
}

export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export interface Channel {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  status: 'connected' | 'disconnected' | 'error';
  signalCount: number;
  lastActive: string;
}

export interface Signal {
  id: string;
  channelId: string;
  symbol: string;
  type: SignalType;
  entry: number;
  sl: number;
  tp: number[];
  status: SignalStatus;
  timestamp: string;
  pnl?: number;
  confidence: number;
  originalMessage: string;
}

export interface TemplateField {
  id: string;
  name: string; // e.g., "Symbol", "Entry"
  key: string; // e.g., "symbol", "entry_price"
  pattern: string; // Regex or marker
  required: boolean;
}

export interface Template {
  id: string;
  name: string;
  channelId: string;
  exampleMessage: string;
  fields: TemplateField[];
  isAutoDetect: boolean;
}