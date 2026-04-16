import mongoose from 'mongoose';

const fcmTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deviceInfo: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export const FcmToken = mongoose.model('FcmToken', fcmTokenSchema);
