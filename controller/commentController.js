import Post from "../models/Post.js";
import Comment from "../models/comment.js";
const addComment = async (req, res) => {
  
  const { postId, ...comment } = req.body;
  comment.user = req.user.userId;
  const commenttosave = new Comment(comment);
  // console.log(commenttosave,req.body);
  const savedcomment = await commenttosave.save();
   
      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comment: savedcomment._id } }
      );
      res.status(200).send({
        status: "success",
        message: "Comment has been created",
      });
};


  export  {addComment};