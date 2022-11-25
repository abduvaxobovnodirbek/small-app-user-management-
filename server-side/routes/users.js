const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changeStatuses,
} = require("../controller/users");

const { AuthProtect, isActiveUser } = require("../middleware/RouteProtect");

router
  .route("/")
  .get(AuthProtect, isActiveUser, getAllUsers)
  .post(AuthProtect, isActiveUser, createUser);

router.route("/status/:id").put(AuthProtect, isActiveUser, changeStatuses);

router
  .route("/:id")
  .put(AuthProtect, isActiveUser, updateUser)
  .delete(AuthProtect, isActiveUser, deleteUser);

module.exports = router;
