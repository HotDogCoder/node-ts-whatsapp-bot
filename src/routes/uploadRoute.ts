import { Router } from "express";
import { uploadController } from "../controllers";
import multer from 'multer';
import path from 'path'

const storage_screenshot = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'storage/screenshots/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const storage_excel_qa = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'storage/qa/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload_screenshot = multer({ storage: storage_screenshot })
const upload_excel_qa = multer({ storage: storage_excel_qa })

const router: Router = Router();

router.post('/upload_screenshot', upload_screenshot.array('multi-files'), uploadController.upload_screenshot)
router.post('/upload_excel_qa', upload_excel_qa.single('qa-file'), uploadController.upload_excel_qa)

export default router