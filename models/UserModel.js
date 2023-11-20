import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, trim: true, unqiue: true },
  location: { type: Object, required: true, trim: true },
  score: { type: Number },
  image: { type: String, trim: true },
  created_at: {
    type: Date,
    required: true,
    trim: true,
    default: new Date(),
  },
  completed_tasks: { type: Array },
  unlocked_missions: { type: Array },
});

const AdminSchema = mongoose.Schema({
  username: { type: String, required: true, trim: true, unqiue: true },
  password: { type: String, required: true, trim: true },
});

const UserModel = mongoose.model("users", UserSchema);
const AdminModel = mongoose.model("admins", AdminSchema);

export { UserModel, AdminModel };
