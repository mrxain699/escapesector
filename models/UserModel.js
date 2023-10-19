import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, trim: true },
  location: { type: Object, required: true, trim: true },
  score: { type: Number },
  image: { type: String, trim: true },
  created_at: { type: Date, required: true, trim: true },
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
