import { Router } from "express";
import { queueController } from "../controllers";

const router: Router = Router();

router.put('/notification', queueController.validateQueue)

export default router