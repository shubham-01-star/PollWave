import request from "supertest";
import app from "../src/app";
import { prisma, BASE_URL, resetDB } from "./setup";

jest.setTimeout(20000); // 20s timeout

describe("User API", () => {
  beforeAll(async () => {
    await resetDB();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new user", async () => {
    const res = await request(app)
      .post(`${BASE_URL}/users`)
      .send({ name: "Test", email: "test@example.com", password: "12345" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should login successfully", async () => {
    const res = await request(app)
      .post(`${BASE_URL}/users/login`)
      .send({ email: "test@example.com", password: "12345" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
