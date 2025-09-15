import { createServer } from "http";
import app from "./app";
import { initSocket } from "./utils/socket";
import { ENV } from "./config/env";

const httpServer = createServer(app);

// Init socket.io
initSocket(httpServer);

httpServer.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
});
