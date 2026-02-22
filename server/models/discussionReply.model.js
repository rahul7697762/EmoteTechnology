import mongoose from "mongoose";

const discussionReplySchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscussionThread",
    required: true,
    index: true
  },

  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscussionReply",
    default: null
  },

  content: {
    type: String,
    required: true,
    maxlength: 5000
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  status: {
    type: String,
    enum: ["ACTIVE", "HIDDEN", "DELETED"],
    default: "ACTIVE"
  }

}, { timestamps: true });

discussionReplySchema.index({ threadId: 1, createdAt: 1 });
discussionReplySchema.index({ parentReplyId: 1 });

export const DiscussionReply = mongoose.model("DiscussionReply", discussionReplySchema);