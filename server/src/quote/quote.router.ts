import mitt from "mitt";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { observable } from "@trpc/server/observable";

const quoteSchema = z.object({
  id: z.number(),
  quote: z.string(),
  author: z.string(),
});

type Quote = z.infer<typeof quoteSchema>;

const fetchRandomQuote = async () => {
  const response = await fetch("https://dummyjson.com/quotes/random", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return quoteSchema.parse(result);
};

const quoteEventEmitter = mitt<{
  "on-random-quote": Quote;
}>();

export const quoteRouter = router({
  getRandomQuote: publicProcedure.query(async (): Promise<Quote> => {
    return fetchRandomQuote();
  }),
  onNewRandomQuote: publicProcedure.subscription(() => {
    return observable<Quote>(emit => {
      const onNewRandomQuote = (data: Quote) => {
        emit.next(data);
      };

      (async () => {
        const quote = await fetchRandomQuote();
        quoteEventEmitter.emit("on-random-quote", quote);
      })();

      quoteEventEmitter.on("on-random-quote", onNewRandomQuote);
    });
  }),
});

setInterval(async () => {
  const quote = await fetchRandomQuote();
  quoteEventEmitter.emit("on-random-quote", quote);
}, 3000);
