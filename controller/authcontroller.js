import User from "../models/User.js";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import { firebaseConfig } from "../Firebase/index.js";
import Blacklist from "../models/Blacklist.js";

initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ username:name , email, password });
  // const token = user.createJWT();
  res.status(200).json({
    user: {
      username: name,
      email: email
    },
  });
};

const logout = async(req,res) =>{
 
  await  Blacklist.create({token : req.user.token})
    res.status(StatusCodes.CREATED).send({msg: "logout succesful"})
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(200).json({  token });
};

const updateUser = async (req, res) => {
  
  const { email, name, lastName, location } = req.body;

//  console.log("Fg");
 
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email || user.email ;
  user.username = name   ||  user.name;
  //   console.log(req)
  user.profilePicture= req.body.imgurl;
  await user.save();

  // // various setups
  // // in this case only id
  // // if other properties included, must re-generate

  // const token = user.createJWT();
  res.status(StatusCodes.OK).json({
      user,
    // token,
  });
};

export { register, login , updateUser , logout};