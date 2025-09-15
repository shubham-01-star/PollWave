// src/controllers/voteController.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { io } from "../utils/socket";

const prisma = new PrismaClient();

export const castVote = async (req: Request, res: Response) => {
  const { userId, optionId } = req.body;

  try {
    console.log("Vote request received:", req.body);

    // Validate user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: "Invalid userId" });

    // Validate option
    const option = await prisma.pollOption.findUnique({ where: { id: optionId } });
    if (!option) return res.status(400).json({ error: "Invalid optionId" });

    // Create vote
    const vote = await prisma.vote.create({
      data: { userId, optionId },
    });
    console.log("✅ Vote created:", vote);

    // Fetch updated poll with votes
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: option.pollId },
      include: { options: { include: { votes: true } } },
    });

    // Emit update to WebSocket room
    io.to(`poll_${option.pollId}`).emit("poll_update", updatedPoll);
    console.log("📢 Poll update emitted for pollId:", option.pollId);

    res.status(200).json(vote);
  } catch (err: any) {
    console.error("❌ Vote error:", err);
    if (err.code === "P2002") {
      return res.status(400).json({ error: "User already voted for this option" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};
