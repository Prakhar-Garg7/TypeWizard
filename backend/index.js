const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./Routes/authRoutes');
const speedRouter = require('./Routes/speedRoutes');
const leaderBoardRouter = require('./Routes/leaderBoardRoutes');
const {Server} = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on('connection', (socket) => {
          console.log("A new user has connected", socket.id);
})

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/speed', speedRouter);
app.use('/api/leaderBoard', leaderBoardRouter);

mongoose.connect('mongodb://127.0.0.1:27017/authentication').then(() => 
          console.log("Connected to mongoDB")
).catch((error) => console.error('Failed to connect to mongoDB: ', error));

app.use((err, req, res, next) => {
          err.statusCode = err.statusCode || 500;
          err.status = err.status || 'error';

          res.status(err.statusCode).json({
                    status: err.status,
                    message: err.message
          })
})

app.listen(PORT, () => {
          console.log(`app is running on ${PORT}`);
})

server.listen(9000, () => {
          console.log(`Server is running on 9000`);
})