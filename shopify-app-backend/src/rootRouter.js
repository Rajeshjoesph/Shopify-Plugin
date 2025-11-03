import { Router } from "express";
import userRouter from "./controllor/user/userRouter.js";
import { verifyToken } from "./middleware/token.js";
import userActionRouter from "./controllor/action/userActionRouter.js"
const router = Router();
router.use('/user', userRouter);
router.use('/userAction',userActionRouter);
export default router;