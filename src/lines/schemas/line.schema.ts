import * as mongoose from 'mongoose';

export const LineSchema = new mongoose.Schema(
  {
    startTime: Date,
    endTime: Date,
    route: {
      type: mongoose.Types.ObjectId,
      ref: 'Route',
    },
    coach: {
      type: mongoose.Types.ObjectId,
      ref: 'Coach',
    },
    tickets: {
      type: [mongoose.Types.ObjectId],
      ref: 'Ticket',
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
