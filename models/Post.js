import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, max: 500 },
    imgurl: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

 export default mongoose.model("Post", PostSchema);