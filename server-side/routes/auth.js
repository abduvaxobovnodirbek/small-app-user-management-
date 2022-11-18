const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateUserInfo,
  updatePassword,
} = require("../controller/auth");
const { AuthProtect,isActiveUser } = require("../middleware/RouteProtect");

router.post("/register", register);
router.post("/login", login);
router.put("/update_userinfo", AuthProtect,isActiveUser, updateUserInfo);
router.put("/update_password", AuthProtect,isActiveUser, updatePassword);

module.exports = router;
