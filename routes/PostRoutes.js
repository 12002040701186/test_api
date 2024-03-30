
import { createPost ,updatePost ,deletePost , likeUnlike ,  getPost , getPostsofUser,getTimeline } from "../controller/PostController.js";
import { Router } from "express";
import multer from "multer";
// import authenticateUser from "../middleware/auth.js";
import auth  from "../middleware/auth.js";
import ImageUploader from "../middleware/Image_uploader.js";
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/",auth,upload.single("filename"),ImageUploader,createPost);
router.put("/:id",auth,upload.single("filename"),ImageUploader, updatePost);
router.delete("/:id",auth,deletePost);
router.get("/timeline",auth,getTimeline);
router.get("/u/:username",getPostsofUser);
router.get("/:id",getPost);
router.put("/:id/like",auth,likeUnlike);

export default router
export {upload};