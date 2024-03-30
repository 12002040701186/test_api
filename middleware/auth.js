import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";
import Blacklist from "../models/Blacklist.js";
const auth = async (req, res, next) => {
  // check header
  
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
  
    // attach the user request object
      if( await Blacklist.findOne({token : token}))
{
   throw new UnAuthenticatedError("Authentication invalid");}
    req.user = payload
    req.user = { userId: payload.userId };
    req.user.token = token
    next();
} catch (error) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
};

export default auth;