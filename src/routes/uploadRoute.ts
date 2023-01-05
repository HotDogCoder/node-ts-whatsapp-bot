import { Router } from "express";
import { uploadController } from "../controllers";
import multer from 'multer';
import path from 'path'

const storage_screenshots = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'storage/screenshots/');
    },
  
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload_screenshot = multer({ storage: storage_screenshots })
const router: Router = Router();

router.post('/upload_screenshot', upload_screenshot.array('multi-files'), uploadController.upload_screenshot)

export default router