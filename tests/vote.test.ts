import request from "supertest";
import app from "../src/app";
import { prisma } from "./setup";
import jwt from "jsonwebtoken";

jest.setTimeout(20000);

describe("Vote API", () => {
  let userId: number;
  let pollOptionId: number;
  let token: string;

  beforeAll(async () => {
    await prisma.vote.deleteMany();
    await prisma.pollOption.deleteMany();
    await prisma.poll.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { name: "Voter", email: "voter@example.com", passwordHash: "pass" },
    });
    userId = user.id;

    token = jwt.sign({ userId }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });

    const poll = await prisma.poll.create({
      data: {
        question: "Favorite color?",
        creatorId: userId,
        options: { create: [{ text: "Red" }, { text: "Blue" }] },
      },
      include: { options: true },
    });

    pollOptionId = poll.options[0].id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should allow voting", async () => {
    const res = await request(app)
      .post("/realtime-polling/api/v1/votes") 
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, optionId: pollOptionId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("should prevent double voting", async () => {
    const res = await request(app)
      .post("/realtime-polling/api/v1/votes") 
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, optionId: pollOptionId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "User already voted for this option");
  });
});
