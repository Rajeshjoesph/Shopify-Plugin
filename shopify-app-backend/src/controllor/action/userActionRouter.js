import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import {createSocialIcon,updateSocialIcon,getAllSocialIcons,updateReorder,postIconStyle} from "./userAction.js"
const router = Router();
router.post('/action', verifyToken,createSocialIcon)
router.put("/updateSocialIcon",verifyToken,updateSocialIcon)
router.get("/getAllSocialIcons",verifyToken,getAllSocialIcons)
router.put("/reorder",verifyToken,updateReorder)
router.post("/postIconStyle",verifyToken,postIconStyle)
export default router;