import mongoose from "mongoose";

const rankedUserSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.ObjectId, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  rank: { type: String, required: true, trim: true },
  time_completed: {
    type: Number,
    required: true,
  },
});

const LeaderboardSchema = mongoose.Schema({
  mission_id: { type: mongoose.Schema.ObjectId, required: true, trim: true },
  ranked_users: [rankedUserSchema],
  created_at: { type: Date, default: new Date() },
});

const LeaderboardModel = mongoose.model("leaderboard", LeaderboardSchema);

export default LeaderboardModel;
