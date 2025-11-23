export interface IUser {
  id: string;
  username: string;
  password: string;
  account_balance: number;
  risk_per_trade: number;
  max_drawdown: number;
  telegram_connected: boolean;
  mt5_connected: boolean;
}
