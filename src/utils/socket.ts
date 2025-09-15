// // src/utils/socket.ts
// import { Server as IOServer, Socket } from "socket.io";
// import { Server as HttpServer } from "http";

// export let io: IOServer;

// export function initSocket(server: HttpServer): IOServer {
//   io = new IOServer(server, { cors: { origin: "*" } });

//   io.on("connection", (socket: Socket) => {
//     console.log("Client connected:", socket.id);

//     // Event: join a poll room
//     socket.on("join_poll", (pollId: number) => {
//       socket.join(`poll_${pollId}`);
//       console.log(`Client ${socket.id} joined poll_${pollId}`);
//     });

//     // Optional: debug vote event listener
//     socket.on("vote_cast", (data: { userId: number; optionId: number; pollId: number }) => {
//       console.log("Vote received via socket (debug only):", data);
//       io.to(`poll_${data.pollId}`).emit("poll_update", { optionId: data.optionId });
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });

//   return io;
// }


// src/utils/socket.ts
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: IOServer | null = null;

export function initSocket(server: HttpServer) {
  io = new IOServer(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_poll", (pollId: number) => {
      socket.join(`poll_${pollId}`);
      console.log(`Client ${socket.id} joined poll_${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

/**
 * Safe emitter - will not throw if io not yet initialized.
 */
export function emitPollUpdate(poll: any) {
  if (!io) {
    console.warn("emitPollUpdate called before io initialized - skipping emit");
    return;
  }
  io.to(`poll_${poll.id}`).emit("poll_update", poll);
}
