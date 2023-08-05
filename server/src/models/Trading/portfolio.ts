import { Schema, model } from 'mongoose';

import { Portfolio } from '../../types/trading';

/*
 The Portfolio model from our database handles all trades and equity positions
*/
const PortfolioSchema = new Schema<Portfolio>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
      unique: true,
    },
    holdings: {
      equity: {
        type: Map,
        of: [
          {
            quantity: {
              type: Number,
              required: true,
              min: 1,
            },
            price: {
              type: Number,
              required: true,
              immutable: true,
              min: 0,
            },
          },
        ],
      },
    },
    history: {
      equity: [
        {
          date: {
            type: Date,
            required: true,
            immutable: true,
            default: Date.now(),
          },
          action: {
            type: String,
            required: true,
            immutable: true,
          },
          order: {
            type: String,
            required: true,
            immutable: true,
          },
          symbol: {
            type: String,
            required: true,
            immutable: true,
          },
          quantity: {
            type: Number,
            required: true,
            immutable: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            immutable: true,
            min: 0,
          },
        },
      ],
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

const modelPortfolio = model<Portfolio>('Portfolio', PortfolioSchema);
export default modelPortfolio;
