import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import {userAction} from "./userAction.js"
const router = Router();
router.post('/action', verifyToken,userAction)
export default router;