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

// Map to keep track of user IDs and their corresponding socket IDs
const userSocketMap = {};

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  // Example of associating socket with user, this will depend on your authentication logic
  socket.on('register_user', (userId) => {
    userSocketMap[userId] = socket.id;
  });

  socket.on("new_message", async ({ message, senderId, recipient, name }) => {
    const savedMessage = await messageController.saveMessage({
      message,
      senderId,
      recipient,
      name,
    });

    console.log('savedMessage', savedMessage)
    // Emit to sender
    const senderSocketId = userSocketMap[senderId];
    console.log('userscoket', userSocketMap)
    console.log('senderSocketId',senderSocketId)
    if (senderSocketId) {
      io.to(senderSocketId).emit("message_received", savedMessage);
    }

    // Emit to recipient
    const recipientSocketId = userSocketMap[recipient];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("message_received", savedMessage);
    }
  });

  socket.on("disconnect", () => {
    // Remove the user from the map on disconnect
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log("user disconnected", socket.id);
  });
});


// io.on("connection", async (socket) => {
//   console.log("A user connected:", socket.id);

//   const messages = await messageController.getMessages();

//   // socket.on("new_message", ({ message, senderId, recipient , name}, customerID, recipientID) => {
//   socket.on("new_message", async ({ message, senderId, recipient, name }) => {
//     const savedMessage = await messageController.saveMessage({
//       message,
//       senderId,
//       recipient,
//       name,
//     });

//     console.log("new message", savedMessage);
//     console.log("new message" + message + "  " + senderId + "  " + recipient + "  " + name);
//     if (recipient === "support") {
//       // Broadcast the message only to the sender and the support team
//       io.to(senderId).emit("message_received", savedMessage);
//       io.to("support").emit("message_received", message);
//     } else {
//       // Handle private one-to-one messaging
//       console.log("mew message", savedMessage);
//       io.to(senderId).emit("message_received", savedMessage);
//       io.to(recipient).emit("message_received", savedMessage);
//     }
//     console.log("message saving.");
//   });


//   socket.on("diconnect", () => {
//     console.log("user disconneted", socket.io);
//   });
// });

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
