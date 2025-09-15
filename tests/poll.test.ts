import request from "supertest";
import app from "../src/app";
import { prisma, BASE_URL, resetDB } from "./setup";

jest.setTimeout(20000);

describe("Poll API", () => {
  let userId: number;
  let token: string;

  beforeAll(async () => {
    await resetDB();

    const user = await prisma.user.create({
      data: { name: "Creator", email: "creator@example.com", passwordHash: "pass" },
    });
    userId = user.id;

    token = require("jsonwebtoken").sign({ userId }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a poll with options", async () => {
    const res = await request(app)
      .post(`${BASE_URL}/polls`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Best language?",
        options: ["JS", "Python"],
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("options");
    expect(res.body.options.length).toBe(2);
  });

  it("should get the poll with results", async () => {
    const poll = await prisma.poll.findFirst();
    const res = await request(app).get(`${BASE_URL}/polls/${poll?.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("options");
  });
});
