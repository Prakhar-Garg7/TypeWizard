const User = require('../Models/userModel');
const CreateError = require('../utils/appError');

exports.setSpeed = async (req, res, next) => {
          try {
                    console.log("req -> body: ", req.body);

                    // Find the user by ID
                    const user = await User.findById(req.body.id);
                    if (!user) return next(new CreateError("User does not exist!", 404));

                    console.log("user: ", user);

                    // Calculate the new average speed
                    const newSpeed = (user.speed * user.matchesPlayed + req.body.currSpeed) / (user.matchesPlayed + 1);

                    // Update the user's speed and matches played
                    user.speed = newSpeed;
                    user.matchesPlayed++;

                    // Add the current speed to the speedsList
                    if (!Array.isArray(user.speedsList)) {
                              user.speedsList = []; // Initialize speedsList if it doesn't exist
                    }
                    user.speedsList.push(req.body.currSpeed);

                    // Save the user
                    await user.save();

                    // Respond with success
                    res.status(201).json({
                              status: "success",
                              message: 'Speed, matchesPlayed, and speedsList updated successfully',
                              speed: user.speed,
                              matchesPlayed: user.matchesPlayed,
                              speedsList: user.speedsList,
                    });
          } catch (error) {
                    next(error);
          }
};
