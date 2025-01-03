const User = require('../Models/userModel');
const CreateError = require('../utils/appError');

exports.getLeaderBoard = async (req, res, next) => {
          try {
                    const user = await User.findById(req.params.id);
                    if (!user) return next(new CreateError("User does not exist!", 404));

                    const PriorityQueue = require('js-priority-queue');
                    const pq = new PriorityQueue({ comparator: (a, b) => a.priority - b.priority });
                    const users = await User.find();
                    let myRank = 0;

                    users.forEach((user1) => {
                              if (user1.speed < user.speed) myRank++;
                              pq.queue({ element: user1.name, priority: user1.speed, speed: user1.speed });
                              if (pq.length > 10) pq.dequeue(); // Changed pq.size() to pq.length
                    });

                    let pqLen = pq.length;
                    let list = [];
                    while (pq.length > 0) {  // Changed pq.size() to pq.length
                              let item = pq.dequeue(); // Dequeue the item
                              list.push({ name: item.element, rank: pqLen, speed: item.speed }); // Add item to the list
                              pqLen--;
                    }
                    list.reverse();

                    res.status(201).json({
                              status: "success",
                              message: 'Leaderboard fetched successfully',
                              mySpeed: user.speed,
                              myRank: myRank,
                              myName: user.name,
                              matchesPlayed: user.matchesPlayed,
                              playersList: list,
                    });
          } catch (error) {
                    next(error);
          }
};
