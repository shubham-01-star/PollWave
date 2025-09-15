import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import pollRoutes from "./routes/poll.routes";
import voteRoutes from "./routes/vote.routes";

const app = express();
app.use(cors());
app.use(express.json());

// Base API prefix
const API_PREFIX = "/realtime-polling/api/v1";

app.get("/", (_, res) => res.send("Real-time Polling API ✅"));

app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/polls`, pollRoutes);
app.use(`${API_PREFIX}/votes`, voteRoutes);

export default app;
