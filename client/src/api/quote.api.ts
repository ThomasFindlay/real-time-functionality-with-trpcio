import { client } from "./api";

export const fetchRandomQuote = () => {
  return client.quotes.getRandomQuote.query();
};

export type SubscribeToRandomQuotesParams = Parameters<
  (typeof client)["quotes"]["onNewRandomQuote"]["subscribe"]
>;

export const subscribeToRandomQuotes = (
  args: SubscribeToRandomQuotesParams[0],
  config: SubscribeToRandomQuotesParams[1]
) => {
  return client.quotes.onNewRandomQuote.subscribe(args, config);
};
