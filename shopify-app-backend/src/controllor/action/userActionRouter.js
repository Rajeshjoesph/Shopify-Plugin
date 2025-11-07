import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import {createSocialIcon,updateSocialIcon,getAllSocialIcons,updateReorder} from "./userAction.js"
const router = Router();
router.post('/action', verifyToken,createSocialIcon)
router.put("/updateSocialIcon",verifyToken,updateSocialIcon)
router.get("/getAllSocialIcons",verifyToken,getAllSocialIcons)
router.put("/reorder",verifyToken,updateReorder)
export default router;