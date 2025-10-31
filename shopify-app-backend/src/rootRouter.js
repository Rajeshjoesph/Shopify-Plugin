import { Router } from "express";
import userRouter from "./controllor/user/userRouter.js";
import { verifyToken } from "./middleware/token.js";
import {userAction} from "./controllor/userAction.js"
const router = Router();
router.use('/user', userRouter);
router.use('/userAction', verifyToken,userAction)
export default router;