import User from "../models/User.js";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";


function check_if_Follower(username_to_check,currentUser){
  console.log(username_to_check);
  let a= username_to_check.filter((item) => { return  item==currentUser})
  // console.log(a.length);
  return a.length == 0;

 
}
const getUserByUsername = async (req, res) => {
      const username = req.params.username;
      const user = await User.findOne({ username: username });
     

      if (!user) {
        throw new BadRequestError("user does not exist");
      }

      res.status(StatusCodes.ACCEPTED).send({
        user: user,
      });
    }

  const getFollowings = async (req, res) => {
   
      const username = req.body.username;
     
      const userfollowings = await User.findOne({ username: username });
    
      if (!userfollowings) {
        throw new BadRequestError("user does not exist");
      }
    console.log((userfollowings),req.user.userId);
      if(check_if_Follower(userfollowings.followers,req.user.userId)&&!(userfollowings._id==req.user.userId))
      {
        throw new BadRequestError("user cannot check users following");
      }
      const followings = await Promise.all(
        userfollowings.followings.map((following) => {
          return User.findById(following, {
            username: true,
            profilePicture: true,
          });
        })
      );
      res.status(200).send({
        followings: followings,
      });
    } 

  const getFollowers = async (req, res) => {
   
      const username = req.body.username;
      const userfollowers = await User.findOne({ username: username });
      if (!userfollowers) {
        throw new BadRequestError("user does not exist");
      }
      // console.log(check_if_Follower(userfollowers.followers,req.user.userId));
      console.log(!(userfollowers._id==req.user.userId));
      if(check_if_Follower(userfollowers.followers,req.user.userId) && !(userfollowers._id==req.user.userId))
     { throw new BadRequestError("cannot check the followers ");}
      if (!userfollowers) {
        throw new BadRequestError("user does not exist");
      }
      const followers = await Promise.all(
        userfollowers.followers.map((follower) => {
          return User.findById(follower, {
            username: true,
            profilePicture: true,
          });
        })
      );
      res.status(200).send({
        data: {
          followings: followers,
        },
      });
  };
  const followUser = async (req, res) => {
   
      const currentUser = await User.findById({ _id: req.user.userId });
      if (currentUser.username !== req.params.username) {
        const usertofollow = await User.findOne({
          username: req.params.username,
        });
        // console.log("Aas")
        if (!usertofollow) {
          throw new Error("user does not exist");
        }
        if (!currentUser.followings.includes(usertofollow._id)) {
          await currentUser.updateOne({
            $push: { followings: usertofollow._id },
          });
          await usertofollow.updateOne({
            $push: { followers: currentUser._id },
          });
          res.status(StatusCodes.ACCEPTED).send({
            message: "user has been followed",
          });
        } else {
          res.status(StatusCodes.BAD_REQUEST).send({msg :"you allready follow this user"});
          };
        }
       else {
        throw new BadRequestError("you can't follow yourself");
      }
  };
  const unfollowUser = async (req, res) => {
   
      const currentUser = await User.findById({ _id: req.user.userId});
      if (currentUser.username !== req.params.username) {
        const usertounfollow = await User.findOne({
          username: req.params.username,
        });
        if (!usertounfollow) {
          throw new Error("user does not exist");
        }
        if (currentUser.followings.includes(usertounfollow._id)) {
          await currentUser.updateOne({
            $pull: { followings: usertounfollow._id },
          });
          await usertounfollow.updateOne({
            $pull: { followers: currentUser._id },
          });
          res.status(StatusCodes.ACCEPTED).send({
            status: "success",
            message: "user has been unfollowed",
          });
        } else {
          throw new BadRequestError("you don't follow this user");
        }
      } else {
        throw new BadRequestError("you can't unfollow yourself");
      }
  
    };
    const searchUsers = async (req, res) => {
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search|| "";
        // console.log(search)
        const users = await User.find({
          username: { $regex: search, $options: "i" },
        })
          .select("_id username profilePicture")
          .limit(limit);
        const totalUsers = users.length;
        res.status(200).send({
          status: "success",
          totalUsers: totalUsers,
          limit: limit,
          users: users,
        });
      
    };
    export { unfollowUser ,followUser , getUserByUsername , getFollowings , getFollowers , searchUsers}