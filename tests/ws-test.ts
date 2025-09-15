import ioClient from "socket.io-client";
import axios from "axios";

// Poll interfaces
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

// Backend URLs
const API_BASE = "http://localhost:4000/realtime-polling/api/v1";
const SOCKET_URL = "http://localhost:4000";

// ✅ Use ReturnType to type socket properly
const socket: ReturnType<typeof ioClient> = ioClient(SOCKET_URL);

async function startClient() {
  socket.on("connect", async () => {
    console.log("✅ Connected to server:", socket.id);

    try {
      const res = await axios.get<Poll[]>(`${API_BASE}/polls`);
      const polls = res.data;

      if (!polls.length) {
        console.log("⚠️ No polls available in DB");
        return;
      }

      const latestPoll = polls[polls.length - 1];
      console.log(`📩 Joining poll_${latestPoll.id} (${latestPoll.question})`);

      socket.emit("join_poll", latestPoll.id);
    } catch (err) {
      console.error("❌ Failed to fetch latest poll:", err);
    }
  });

  socket.on("poll_update", (data: Poll) => {
    console.log("🔥 Updated poll data:", JSON.stringify(data, null, 2));
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
  });
}

startClient();
