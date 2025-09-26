import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";


const prisma = new PrismaClient();

interface PollOption {
  id: number;
  text: string;
  votes: { id: number; userId: number }[];
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}


export async function createPoll(req: AuthRequest, res: Response) {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: "Question and options are required" });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: true,
        creatorId: req.userId!, // Auth middleware sets userId
        options: { create: options.map((text: string) => ({ text })) },
      },
      include: { options: true },
    });

    res.status(201).json(poll);
  } catch (err: any) {
    console.error("Create Poll Error:", err);
    res.status(500).json({ error: "Something went wrong while creating the poll" });
  }
}

export async function getPoll(req: AuthRequest, res: Response) {
  try {
    const pollId = Number(req.params.id);
    if (isNaN(pollId)) return res.status(400).json({ error: "Invalid poll id" });

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { include: { votes: true } } },
    });

    if (!poll) return res.status(404).json({ error: "Poll not found" });

    res.json(poll);
  } catch (err: any) {
    console.error("Get Poll Error:", err);
    res.status(500).json({ error: "Something went wrong while fetching the poll" });
  }
}

export async function getPolls(req: AuthRequest, res: Response) {
  try {
    const polls = await prisma.poll.findMany({
      include: { options: { include: { votes: true } } },
      orderBy: { createdAt: 'asc' } 
    });

    res.json(polls);
  } catch (err: any) {
    console.error("Get Polls Error:", err);
    res.status(500).json({ error: "Something went wrong while fetching polls" });
  }
}
