import express from "express";
import {trackClick,clickCount} from "./clickAnalytics.js";
import { verifyToken } from "../../middleware/token.js";


const AnalyticsRouter = express.Router();

AnalyticsRouter.post("/track-click", trackClick);
AnalyticsRouter.get("/click-count", verifyToken,clickCount);

export default AnalyticsRouter;
