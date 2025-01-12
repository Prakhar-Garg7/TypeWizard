const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./Routes/authRoutes');
const speedRouter = require('./Routes/speedRoutes');
const leaderBoardRouter = require('./Routes/leaderBoardRoutes');
const profileRouter = require('./Routes/profileRoutes');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
          cors: {
                    origin: "http://localhost:3000",
                    methods: ["GET", "POST"],
          }
});

// Socket.io
let roomNo = 0;
let people = 0;
let roomVsSocketList = {};
let scores = {}; // Store scores dynamically for each room

io.on('connection', (socket) => {
          console.log("A new user has connected", socket.id);

          // Assign the user to a room
          socket.join("room-" + roomNo);
          roomVsSocketList[socket.id] = roomNo;

          // Initialize scores for the room if it doesn't exist yet
          if (!scores[roomNo]) {
                    scores[roomNo] = [];
          }

          // Store the socketId for the player in the scores array for the room
          scores[roomNo].push({ socketId: socket.id, score: 0 });

          people++;

          // When 2 players are in the room, emit 'RoomFull'
          if (people == 2) {
                    io.sockets.in("room-" + roomNo).emit("RoomFull", "Can start the game");
                    roomNo++; // Increment room number
                    people = 0; // Reset player count for the next room
          }

          // Listen for the 'receiveScoreFromSocket' event
          socket.on("receiveScoreFromSocket", () => {
                    let yourRoomNo = roomVsSocketList[socket.id];
                    let newScore = 0;

                    // Find the player index in the room's score list
                    const playerIndex = scores[yourRoomNo].findIndex(player => player.socketId === socket.id);

                    if (playerIndex !== -1) {
                              scores[yourRoomNo][playerIndex].score++;
                              newScore = scores[yourRoomNo][playerIndex].score;

                              // Send updated scores to both players
                              const opponentIndex = playerIndex === 0 ? 1 : 0; // Assuming only two players per room
                              io.to(socket.id).emit("getUpdatedScore", {
                                        yourScore: newScore,
                                        opponentScore: scores[yourRoomNo][opponentIndex].score,
                              });
                              io.to(scores[yourRoomNo][opponentIndex].socketId).emit("getUpdatedScore", {
                                        yourScore: scores[yourRoomNo][opponentIndex].score,
                                        opponentScore: newScore,
                              });
                    }
          });

          // Listen for the 'gameWon' event
          socket.on("gameWon", () => {
                    let yourRoomNo = roomVsSocketList[socket.id];

                    // Find the player index in the room's score list
                    const playerIndex = scores[yourRoomNo].findIndex(player => player.socketId === socket.id);

                    if (playerIndex !== -1) {
                              const opponentIndex = playerIndex === 0 ? 1 : 0; // Assuming only two players per room

                              // Emit game results to both players
                              io.to(socket.id).emit("getGameResults", { result: "Won" });
                              io.to(scores[yourRoomNo][opponentIndex].socketId).emit("getGameResults", { result: "Lose" });
                    }
          });

          // Handle disconnection
          socket.on('disconnect', () => {
                    console.log("User disconnected", socket.id);
                    // Optionally handle disconnection logic, like cleaning up scores or rooms
          });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/speed', speedRouter);
app.use('/api/leaderBoard', leaderBoardRouter);
app.use('/api/profile', profileRouter);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/authentication')
          .then(() => console.log("Connected to mongoDB"))
          .catch((error) => console.error('Failed to connect to mongoDB: ', error));

// Error handling middleware
app.use((err, req, res, next) => {
          err.statusCode = err.statusCode || 500;
          err.status = err.status || 'error';
          res.status(err.statusCode).json({
                    status: err.status,
                    message: err.message
          });
});

// Server setup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
          console.log(`App is running on ${PORT}`);
});

server.listen(9000, () => {
          console.log(`Server is running on 9000`);
});
