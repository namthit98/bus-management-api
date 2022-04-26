import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    fullname: String,
    email: String,
    identification: String,
    phone: String,
    birthday: Date,
    active: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
