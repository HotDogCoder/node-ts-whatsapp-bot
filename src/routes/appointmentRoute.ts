import { Router } from "express";
import { appointmentController } from "../controllers";

const router: Router = Router();

router.put('/scheduler', appointmentController.schedulerNotification)
router.delete('/scheduler/remove', appointmentController.deleteNotification)

export default router