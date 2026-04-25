import { Router } from 'express';
import multer from 'multer';
import { inventoryAnalyzeController } from '../controllers/inventory.controller.js';

const router = Router();

const uploadMiddleware = (fieldname) => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

    return upload.single(fieldname);
}

router.post('/analyze-inventory', uploadMiddleware('inventory'), inventoryAnalyzeController)

export default router;

