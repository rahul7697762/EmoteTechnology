import mongoose from "mongoose";

const discussionReplySchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscussionThread",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: ["ACTIVE", "HIDDEN", "DELETED"],
    default: "ACTIVE"
  },

  deletedAt: Date
}, {
  timestamps: true
});

// INDEXS 
// Load replies for a thread (ordered)
discussionReplySchema.index(
  { threadId: 1, createdAt: 1 }
);

// User activity
discussionReplySchema.index({ userId: 1 });

// Soft delete
discussionReplySchema.index({ deletedAt: 1 });

export const DiscussionReply = mongoose.model("DiscussionReply", discussionReplySchema);