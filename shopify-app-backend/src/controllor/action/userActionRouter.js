import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import {createSocialIcon,updateSocialIcon,getAllSocialIcons} from "./userAction.js"
const router = Router();
router.post('/action', verifyToken,createSocialIcon)
router.put("/updateSocialIcon",verifyToken,updateSocialIcon)
router.get("/getAllSocialIcons",verifyToken,getAllSocialIcons)
export default router;