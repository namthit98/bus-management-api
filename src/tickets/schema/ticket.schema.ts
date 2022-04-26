import * as mongoose from 'mongoose';

export const ticketSchema = new mongoose.Schema(
  {
    fullname: String,
    phone: String,
    email: String,
    status: {
      type: String,
      default: 'unpaid',
    },
    lineId: {
      type: mongoose.Types.ObjectId,
      ref: 'Line',
    },
  },
  {
    timestamps: true,
  },
);
