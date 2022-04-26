import * as mongoose from 'mongoose';

export const RouteSchema = new mongoose.Schema(
  {
    startingPoint: String,
    destination: String,
    price: Number,
    timeShift: Number,
    distance: Number,
    pickupPoint: String,
    dropoffPoint: String,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
