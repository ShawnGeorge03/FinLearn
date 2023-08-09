import { Schema, model } from 'mongoose';

import { Account } from '../../types/trading';

/*
 The Account model from our database handles all static information for trades
*/
const AccountSchema = new Schema<Account>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
      unique: true,
    },
    cash: {
      // Available Funds for Trade
      type: Number,
      min: 0,
      default: 100000,
      required: true,
    },
    value: {
      // Value is based on Cash + Present Returns from Holdings
      type: Number,
      default: 100000,
      required: true,
    },
  },
  {
    toJSON: {
      // This function returns a JSON without id, __v
      transform: (doc, ret) => {
        delete ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const modelAccount = model<Account>('Account', AccountSchema);
export default modelAccount;
