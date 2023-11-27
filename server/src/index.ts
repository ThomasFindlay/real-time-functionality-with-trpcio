import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { quoteRouter } from "./quote/quote.router";
import { router } from "./trpc";
import cors from "cors";
import ws from "ws";

const PORT = 3000;

const wss = new ws.Server({
  port: 3001,
});
const appRouter = router({
  quotes: quoteRouter,
});

const handler = applyWSSHandler({ wss, router: appRouter });

export type AppRouter = typeof appRouter;

const { server, listen } = createHTTPServer({
  middleware: cors({
    origin: "http://localhost:5173",
  }),
  router: appRouter,
});

server.on("listening", () => {
  console.log(`Server listening on port ${PORT}`);
});

listen(PORT);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
