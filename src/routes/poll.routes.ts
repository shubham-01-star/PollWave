import { Router } from "express";
import { createPoll, getPoll,getPolls } from "../controllers/poll.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.post("/", authMiddleware, createPoll);
router.get("/", getPolls); 
router.get("/:id", getPoll);
export default router;
