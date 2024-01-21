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
const messageRotues = require("./routes/message");

const messageController = require("./controllers/message");
const Customer = require("./models/customer");

app.use("/auth", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/message", messageRotues);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// to track user id
const userSocketMap = {};

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register_user", (userId) => {
    userSocketMap[userId] = socket.id;
  });

  socket.on(
    "new_message",
    async ({ message, senderId, recipient, name, to }) => {
      const savedMessage = await messageController.saveMessage({
        message,
        senderId,
        recipient,
        name,
        to: to ? to : undefined,
      });

      const sender = await Customer.findById({ _id: senderId });
      await sender.addMessage(savedMessage._id);

      // console.log('savedMessage', savedMessage)
      const senderSocketId = userSocketMap[senderId];
      // console.log('userscoket', userSocketMap)
      // console.log('senderSocketId',senderSocketId)
      if (senderSocketId) {
        io.to(senderSocketId).emit("message_received", savedMessage);
      }

      const recipientSocketId = userSocketMap[recipient];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message_received", savedMessage);
      }
    }
  );

  socket.on("disconnect", () => {
    // delete the user from the map ids.
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log("user disconnected", socket.id);
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
    console.log(err.message);
  });
