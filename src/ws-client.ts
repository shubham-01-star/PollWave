// // src/ws-client.ts
// import io from "socket.io-client";

// interface PollOption {
//   id: number;
//   text: string;
//   votes: { id: number; userId: number }[];
// }

// interface Poll {
//   id: number;
//   question: string;
//   options: PollOption[];
// }

// // Connect to backend server
// const socket = io("http://localhost:4000");

// socket.on("connect", () => {
//   console.log("✅ Connected to server:", socket.id);

//   // Example: choose a pollId to join (replace with actual pollId from DB)
//   const pollId = 22;
//   console.log(`📩 Joining poll_${pollId}`);
//   socket.emit("join_poll", pollId);
// });

// // Listen for poll updates
// socket.on("poll_update", (data: Poll) => {
//   console.log("🔥 Updated poll data:", JSON.stringify(data, null, 2));
// });

// // Handle disconnect
// socket.on("disconnect", () => {
//   console.log("❌ Disconnected from server");
// });


import io from "socket.io-client";
import axios from "axios";

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

// Socket client
const socket = io(SOCKET_URL);

socket.on("connect", async () => {
  console.log("✅ Connected to server:", socket.id);

  try {
    // 🔹 Step 1: Fetch latest poll from API
    const res = await axios.get<Poll[]>(`${API_BASE}/polls`);
    const polls = res.data;

    if (!polls.length) {
      console.log("⚠️ No polls available in DB");
      return;
    }

    // 🔹 Step 2: Pick the latest poll (last one in array)
    const latestPoll = polls[polls.length - 1];
    console.log(`📩 Joining poll_${latestPoll.id} (${latestPoll.question})`);

    // 🔹 Step 3: Join the poll room dynamically
    socket.emit("join_poll", latestPoll.id);
  } catch (err) {
    console.error("❌ Failed to fetch latest poll:", err);
  }
});

// Listen for poll updates
socket.on("poll_update", (data: Poll) => {
  console.log("🔥 Updated poll data:", JSON.stringify(data, null, 2));
});

// Handle disconnect
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
