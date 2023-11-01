import mongoose from "mongoose";

const tasksSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true },
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  hints: { type: Array, required: true },
  location: { type: Object, required: true },
  message: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
});

const SectorSchema = mongoose.Schema({
  title: { type: String, required: true, trim: true },
  difficulty: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  distance: { type: Number, required: true, trim: true },
  duration: { type: Number, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  location: { type: Object, required: true },
  tasks: [tasksSchema],
  creator: { type: String, required: true, trim: true },
  official: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: new Date() },
});

const SectorModel = mongoose.model("sectors", SectorSchema);

export default SectorModel;
