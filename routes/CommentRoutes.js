import { Router } from "express";
import { addComment  } from "../controller/commentController.js";
import auth from "../middleware/auth.js";
const router =Router();
router.post("/",auth,addComment);
export default router;