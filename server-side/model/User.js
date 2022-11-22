const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt  = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 1,
    select: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
},
});

UserSchema.statics.setNewLoginTime = function login(id, callback) {
  return this.findByIdAndUpdate(id,{'$set' : { 'lastLoginAt' : Date.now()} }, { new : true }, callback);
};

//hash the password using bcrypt before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Generate JWT using Instance methods
UserSchema.methods.GenerateJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Check the entered password with password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
