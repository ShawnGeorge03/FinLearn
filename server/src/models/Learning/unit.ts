import { Schema, model } from 'mongoose';

import { Unit } from '../../types/learning';

/*
The unit model from our database
*/
const UnitSchema = new Schema<Unit>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    content: [{ type: Schema.Types.Mixed }],
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

const modelUnit = model<Unit>('Unit', UnitSchema);
export default modelUnit;
