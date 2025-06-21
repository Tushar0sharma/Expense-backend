// utils/multer.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage ,limits: {
  fileSize: 10 * 1024 * 1024, 
}},);


export default upload;
