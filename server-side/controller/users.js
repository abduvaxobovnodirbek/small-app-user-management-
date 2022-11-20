const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../model/User");

//description  Get all users
//route        GET /api/v1/users
//access       Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  const users = await User.find().skip(startIndex).limit(limit);

  res.status(200).json({ success: true, count: users.length, data: users });
});

//description    Create new user
//route          POST /api/v1/users
//access         Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(
      new ErrorResponse(
        `user with id ${req.user.id} is exists in database`,
        403
      )
    );
  }
  const new_user = await User.create({ name, email, password });
  res.status(201).json({ success: true, data: new_user });
});

//description  Update  user
//route        PUT /api/v1/users/:id
//access       Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: user });
});

//description    Delete  User
//route   GET /api/v1/users/:id
//access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const ids = req.params.id.split(',')
  User.deleteMany({_id: { $in: ids}}, function(err) {
    if(err){
      next(
        new ErrorResponse(`User not found, 404`)
      )
    }
  })
  res.status(204).json({ success: true, data: 'user has successfully been deleted'});
});
