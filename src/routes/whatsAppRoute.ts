import { Router } from "express";
import { whatsAppController } from "../controllers";

const router: Router = Router();

router.post('/group/new', whatsAppController.newGroup)
router.delete('/group/participants/remove', whatsAppController.removeParticipants)
router.put('/group/participants/add', whatsAppController.addParticipants)
router.post('/send', whatsAppController.sendMessage)
router.post('/contact', whatsAppController.contact)

export default router