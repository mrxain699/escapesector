import mongoose from "mongoose";
const SideQuestSchema = mongoose.Schema({
  mission_id: { type: String, required: true, trim: true },
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  options: { type: Array, required: true },
  image: { type: String, trim: true },
  createdAt: { type: Date, required: true, default: new Date() },
});

const SideQuestModel = mongoose.model("sidequests", SideQuestSchema);

export default SideQuestModel;
