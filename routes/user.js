const { Router } = require("express");

const UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

const userRouter = Router();
const userController = new UserController();

userRouter.post("/users/signup", userController.signUp);

userRouter.post("/users/login", userController.loginUser);

userRouter.get("/users/profile", auth, userController.getUser);

userRouter.patch("/users/update", auth, userController.updateUser);

userRouter.delete("/users/delete", auth, userController.deleteUser);

module.exports = userRouter;