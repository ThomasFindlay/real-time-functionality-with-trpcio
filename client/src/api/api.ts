import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { type AppRouter } from "../../../server/src/index";

const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "http://localhost:3000",
      }),
    }),
  ],
});
