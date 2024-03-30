import { register, login ,updateUser, logout} from "../controller/authcontroller.js";
import { getFollowers,getFollowings,getUserByUsername ,followUser,unfollowUser ,searchUsers } from "../controller/UserController.js";
import { Router } from "express";
import multer from "multer";
// import authenticateUser from "../middleware/auth.js";
import auth  from "../middleware/auth.js";
const router = Router();
import rateLimiter from "express-rate-limit";
import ImageUploader from "../middleware/Image_uploader.js";
import { upload } from "./PostRoutes.js";
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
router.route("/auth/register").post(apiLimiter, register);
router.route("/auth/login").post(apiLimiter, login);
router.route("/auth/logout").post(auth, logout);
router.route("/auth/updateUser").patch(auth,upload.single("filename"),ImageUploader,updateUser);
 router.get("/searchUser", searchUsers);
router.get("/u/:username", getUserByUsername);
// router.get("/:id", getUser);
router.get("/followings/", auth,getFollowings);
router.get("/followers/", auth,getFollowers);
router.put(
  "/:username/follow",
 auth,
followUser
);
router.put(
  "/:username/unfollow",
auth,
unfollowUser
);
export default router;