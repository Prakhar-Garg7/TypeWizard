const User = require('../Models/userModel');
const CreateError = require('../utils/appError');

exports.getProfile = async (req, res, next) => {
          try {
                    const user = await User.findById(req.params.id).populate('friends', 'name');
                    if (!user) return next(new CreateError("User does not exist!", 404));
                    const users = await User.find();

                    res.status(201).json({
                              status: "success",
                              message: 'Profile data fetched successfully',
                              friends: user.friends,
                              allUsers: users,
                    });
          } catch (error) {
                    next(error);
          }
};
