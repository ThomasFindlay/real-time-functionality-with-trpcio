import { useState, useEffect } from "react";
import "./App.css";
import { fetchRandomQuote, subscribeToRandomQuotes } from "./api/quote.api";

type Quote = {
  id: number;
  quote: string;
  author: string;
};

function App() {
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [latestRandomQuote, setLatestRandomQuote] = useState<Quote | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const quote = await fetchRandomQuote();
      setRandomQuote(quote);
    })();

    const subscription = subscribeToRandomQuotes(undefined, {
      onData(data: Quote) {
        setLatestRandomQuote(data);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <p>Quote:</p>
      {randomQuote ? (
        <div>
          <p>{randomQuote.quote}</p>
          <p>{randomQuote.author}</p>
        </div>
      ) : null}

      <hr />

      <p>Quote from subscription:</p>
      {latestRandomQuote ? (
        <div>
          <p>{latestRandomQuote.quote}</p>
          <p>{latestRandomQuote.author}</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
