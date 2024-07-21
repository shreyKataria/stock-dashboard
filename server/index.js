const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 8000;

let stockPrices = {
  GOOG: 1500,
  TSLA: 700,
  AMZN: 3100,
  META: 250,
  NVDA: 600,
};

const randomPriceUpdate = () => {
  for (const stock in stockPrices) {
    stockPrices[stock] += (Math.random() - 0.5) * 10;
    stockPrices[stock] = Math.round(stockPrices[stock] * 100) / 100; // Round to 2 decimal places
  }
};

setInterval(() => {
  randomPriceUpdate();
  io.emit("stockUpdate", stockPrices);
}, 1000);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("initialStocks", stockPrices);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
