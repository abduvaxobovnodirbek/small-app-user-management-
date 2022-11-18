const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../model/User");

// description    Register user
// route         POST /api/v1/auth/register
// access        Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //check if the user is already in database
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return next(
      new ErrorResponse(
        `The user with '${email}' already exists in database`,
        400
      )
    );
  }

  //create user
  const user = await User.create({ name, email, password });

  //Create token
  const token = user.GenerateJWT();

  res.status(200).json({ success: true, token });
});

// description  Login User
// route        POST /api/v1/auth/login
// access       Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide credentials`, 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorResponse(`The user with '${email}' not  exists in database`, 400)
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials entered`, 400));
  }

  if (user && !user.status) {
    return next(new ErrorResponse(`User account is blocked`, 400));
  }

  const token = user.GenerateJWT();

  res.status(201).json({ success: true, token });
});

//description   Update Personal Details
//route         PUT /api/v1/auth/update_userinfo
//access        Private
exports.updateUserInfo = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse("no user found", 404));
  }

  res.status(200).json({ success: true, data: user });
});

//description    UPDATE USER Password
//route          PUT /api/v1/auth/update_password
//access         Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorResponse("no user found", 404));
  }

  if (!(await user.matchPassword(req.body.password))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = user.GenerateJWT();

  res.status(200).json({ success: true, token });
});
