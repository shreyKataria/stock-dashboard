import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const App = () => {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [subscribedStocks, setSubscribedStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});

  useEffect(() => {
    socket.on("initialStocks", (initialStocks) => {
      setStockPrices(initialStocks);
    });

    socket.on("stockUpdate", (updatedStocks) => {
      setStockPrices(updatedStocks);
    });

    return () => {
      socket.off("initialStocks");
      socket.off("stockUpdate");
    };
  }, []);

  const handleLogin = () => {
    if (email) {
      setLoggedIn(true);
    }
  };

  const handleSubscribe = (stock) => {
    setSubscribedStocks([...subscribedStocks, stock]);
  };

  if (!loggedIn) {
    return (
      <div>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {email}</h2>
      <h3>Subscribe to a stock</h3>
      {["GOOG", "TSLA", "AMZN", "META", "NVDA"].map((stock) => (
        <button key={stock} onClick={() => handleSubscribe(stock)}>
          {stock}
        </button>
      ))}
      <h3>Subscribed Stocks</h3>
      <ul>
        {subscribedStocks.map((stock) => (
          <li key={stock}>
            {stock}: ${stockPrices[stock] || "Loading..."}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
