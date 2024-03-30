import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import multer from "multer";
import { firebaseConfig } from "../Firebase/index.js";

initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();
const ImageUploader=  async (req,res,next) =>{

//   console.log("s")
    if(req.file)
    {
      //  if(req.file.size()>1)
      //  throw new BadRequestError("only  one image possible" );
      if(!req.file.mimetype.includes("image"))
      throw new BadRequestError("Must be image" );
      if(req.file.size > 1024 * 1024)
      throw new BadRequestError("Must be image" );
    } 
    const storageRef = ref(storage, `Posts/${req.user.userId + new Date().getTime()}`);
  
    // Create file metadata including the content type
    
    const metadata = {
        contentType: req.file.mimetype,
    };
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
   
  
    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    req.body.imgurl = downloadURL;
    next();
}
export default ImageUploader