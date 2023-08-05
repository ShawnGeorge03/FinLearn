import { Types } from 'mongoose';

/*
Types needed for Trading models
*/

export type Position = {
  price: number;
  quantity: number;
};

export interface Equity {
  _id?: Types.ObjectId;
  date?: Date;
  action: 'buy' | 'sell';
  order: 'market';
  symbol: string;
  quantity: number;
  price: number;
}

export interface Portfolio {
  userID: Types.ObjectId;
  holdings: {
    equity: Map<string, Position[]>;
  };
  history: {
    equity: Equity[];
  };
}

export interface Account {
  userID: Types.ObjectId;
  cash: number;
  value: number;
}
