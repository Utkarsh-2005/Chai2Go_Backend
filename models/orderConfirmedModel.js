import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  orderno: { type: String, required: true },
  message: { type: String, required: true },
  username: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification =  mongoose.model('Notification', NotificationSchema);
