import mongoose, { Schema, Types } from "mongoose";

const DogSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
  //   name: { type: String, required: true },
  //   profilePic: { type: String, required: true },
  //   pictures: [String],
  //   selfSummary: String,
  //   breed: { type: String, required: true },
  //   age: { type: Number, required: true },
  //   size: { type: String, required: true },
  //   weight: { type: Number, required: true },
  //   address: { type: String, required: true },
  //   likes: [Types.ObjectId],
  //   dislikes: [Types.ObjectId],
  //   matches: [Types.ObjectId],
  //   createdDate: Number
});

export default mongoose.model("Dog", DogSchema);
