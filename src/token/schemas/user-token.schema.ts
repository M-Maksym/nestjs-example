import * as mongoose from 'mongoose';

export const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  uId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiredAt: { type: Date, required: true },
});

TokenSchema.index({ token: 1, uId: 1 }, { unique: true });
