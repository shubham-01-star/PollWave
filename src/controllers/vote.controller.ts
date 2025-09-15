// src/controllers/vote.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { emitPollUpdate } from "../utils/socket";

const prisma = new PrismaClient();

export async function castVote(req: Request, res: Response) {
  const { userId, optionId } = req.body;

  try {
    console.log("Vote request received:", req.body);

    // validate user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: "Invalid userId" });

    // validate option (and get pollId)
    const option = await prisma.pollOption.findUnique({ where: { id: optionId } });
    if (!option) return res.status(400).json({ error: "Invalid optionId" });

    // prevent duplicate vote by same user in the same poll
    const existingVote = await prisma.vote.findFirst({
      where: { userId, option: { pollId: option.pollId } },
    });
    if (existingVote) return res.status(400).json({ error: "User already voted in this poll" });

    // create vote
    const vote = await prisma.vote.create({ data: { userId, optionId } });
    console.log("✅ Vote created:", vote);

    // fetch updated poll with votes
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: option.pollId },
      include: { options: { include: { votes: true } } },
    });

    // safe emit
    if (updatedPoll) {
      emitPollUpdate(updatedPoll);
      console.log("📢 Poll update emitted for pollId:", option.pollId);
    }

    return res.status(200).json(vote);
  } catch (err: any) {
    console.error("❌ Vote error:", err);
    if (err?.code === "P2002") {
      return res.status(400).json({ error: "User already voted for this option" });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
}
