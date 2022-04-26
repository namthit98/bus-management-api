import * as mongoose from 'mongoose';

export const CoachSchema = new mongoose.Schema(
  {
    name: String,
    licensePlates: String,
    seats: Number,
    type: String,
    // route: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'Route',
    // },
    driver: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
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
