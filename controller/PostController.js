import Post from "../models/Post.js"
import Comment from "../models/comment.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

const createPost = async (req, res) => {
  req.body.user = req.user.userId;
  const newArticle = new Post(req.body); 
     await newArticle.save();
    res.status(StatusCodes.CREATED).send({
      message: "article has been created",
    });
  
};
const updatePost = async (req, res) => {
  
    const article = await Post.findById(req.params.id);
    console.log(article , req.body)
    if (req.user.userId === article.user.toString()) {
      await article.updateOne({ $set: req.body});
      res.status(StatusCodes.CREATED).send({
        message: "article has been updated",
      });
    }
  
};
const deletePost = async (req, res) => {

    const article = await Post.findById(req.params.id);
    if (req.user.userId == article.user.toString()) {
      
      await Comment.deleteMany({ _id : { $in : article.comment} });
      // console.log(req.user.userId == article.user.toString())
      await Post.findByIdAndDelete(req.params.id);
      res.status(StatusCodes.CREATED).send({
        message: "article has been deleted",
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send({
        message: "you are not authorized",
      });
    }
  
};
const getTimeline = async (req, res) => {

    const userid = req.user.userId;
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 1;
    const days=  parseInt(req.query.daysago)
    const user = await User.findById(userid).select("followings");
    const myArticles = await Post.find({ user: userid })
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: "desc" })
      .populate("user", "username profilePicture");
      // console.log(user);
    const followingsArticles = await Promise.all(
      user.followings.map((followingId) => {
        return Post.find({
          user: followingId,
          createdAt: {
            // $lte :  new Date(new Date().getTime() - 86400000).toISOString() ,
            $gte: new Date(new Date().getTime() - days*86400000).toISOString(),
          },
        })
          .skip(page * limit)
          .limit(limit)
          .sort({ createdAt: "desc" })
          .populate("user", "username profilePicture");
      })
    );
  let   arr = myArticles.concat(...followingsArticles);
    res.status(200).send({
      status: "success",
      Posts: arr,
      limit: arr.length,
    });
 
};



const getPostsofUser = async (req, res) => {

    const user = await User.findOne({ username: req.params.username });
    // console.log(user);
    const articles = await Post.find({ user: user._id });
    res.status(StatusCodes.ACCEPTED).json(articles);
};
const getPost = async (req, res) => {
  
    const article = await Post.findOne({ _id: req.params.id }).populate(
      "comment"
    );
    res.status(StatusCodes.ACCEPTED).json(article);
};
const likeUnlike = async (req, res) => {
  
    const article = await Post.findById(req.params.id);
    if (!article.likes.includes(req.user.userId)) {
      await Post.updateOne({ $push: { likes: req.user.userId } });
      res.status(200).send({
        status: "success",
        message: "the article has been liked",
      });
    } else {
      await Post.updateOne({ $pull: { likes: req.user.userId } });
      res.status(200).send({
        status: "success",
        message: "the article has been disliked",
      });
    }
   
};

export { createPost , updatePost , deletePost,likeUnlike , getPost ,getPostsofUser , getTimeline}