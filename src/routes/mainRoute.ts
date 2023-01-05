import { Router } from "express";
import { mainController } from "../controllers";

const router: Router = Router();

router.get('/', mainController.index)

export default router