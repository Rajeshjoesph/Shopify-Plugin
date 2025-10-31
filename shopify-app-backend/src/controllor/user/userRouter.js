import { Router } from "express";
import { createUser,userLogin } from "../user/userAuth.js";
const router = Router();

router.post('/register',createUser)
router.post('/login',userLogin)

export default router;