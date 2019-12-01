import mongoose, { Schema } from "mongoose";

//Dog Database Schema

const DogSchema = new Schema({
  refreshTokenCount: { type: Number, default: 0 },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 8, max: 16 },
  name: { type: String, required: true },
  profilePic: { type: String, required: true },
  pictures: [String],
  selfSummary: String,
  breed: { type: String, required: true },
  age: { type: String, required: true },
  size: { type: String, required: true },
  weight: { type: Number, required: true },
  address: { type: String, required: true },
  likes: [Schema.Types.ObjectId],
  dislikes: [Schema.Types.ObjectId],
  matches: [Schema.Types.ObjectId],
  createdDate: String
});

export default mongoose.model("Dog", DogSchema);
