const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const customerRoutes = require("./routes/customer");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const messageController = require("./controllers/message");

app.use("/auth", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // The origin of your frontend
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});
// A simple in-memory structure to store messages
let messages = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send existing messages to the newly connected user
  socket.emit("existing_messages", messages);

  // Listen for new messages
  socket.on("new_message", (message) => {
    //  console.log('New message received:', message);
    messageController.saveMessage(message);
    //  messages.push(message); // Store the message

    io.emit("message_received", message); // Broadcast the message to all clients
  });

  socket.on("diconnect", () => {
    console.log("user disconneted", socket.io);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Laundry Service API" });
});

server.listen(PORT, () => {
  console.log("Server is listening on PORT " + PORT);
});

mongoose
  .connect(process.env.mongoURI)
  .then(() => {
    console.log("connected");
  })

  .catch((err) => {
    console.log(err);
  });
