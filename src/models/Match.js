import mongoose, { Schema } from "mongoose";

const MatchSchema = new Schema({
  dog1: { type: Schema.Types.ObjectId, required: true },
  dog2: { type: Schema.Types.ObjectId, required: true },
  matchDate: { type: Date, required: true }
});

export default mongoose.model("Match", MatchSchema);
