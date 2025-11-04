import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import {createSocialIcon,updateSocialIcon} from "./userAction.js"
const router = Router();
router.post('/action', verifyToken,createSocialIcon)
router.put("/updateSocialIcon",verifyToken,updateSocialIcon)
export default router;