const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../model/user");

class UserController {
  async signUp(req, res, next) {
    const { username, email, password } = req.body;

    try {
      if (!username || !email || !password) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (username, email, and password) cannot be empty",
        });
        return;
      }

      const user = await User.findOne({ username });
      if (user) {
        res.status(409).json({
          status: 409,
          message: "User already exists. Pick a new username",
        });
        return;
      }

      const userEmail = await User.findOne({ email });
      if (userEmail) {
        res.status(409).json({
          status: 409,
          message: "User already exists. Pick a new email",
        });
        return;
      }

      const newUser = await User.create({
        username,
        email,
        password,
      });

      await newUser.save();

      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: {
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: 400,
          message: "Bad Request. Fields (email, and password) cannot be empty",
        });
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          status: 404,
          message: "User doesn't exist. Please create an account.",
        });
        return;
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        res.status(404).json({
          status: 404,
          message: "Wrong email/password combination",
        });
        return;
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        status: 200,
        message: "Login Successful",
        data: {
          email: user.email,
          username: user.username,
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      res.status(200).json({
        status: 200,
        message: "User fetched successfully",
        data: {
          username: req.user.username,
          email: req.user.email,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async updateUser(
    req,
    res,
    next
  ) {
    try {
      const { username, password } = req.body;

      if (Object.keys(req.body).length === 0) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. One of fields (username and password) cannot be empty",
        });
        return;
      }

      let updates = {};
      updates.$set = {
        username,
        password,
      };

      const user = await User.findByIdAndUpdate({ _id: req.user.id }, updates, {
        new: true,
      });
      if (!user) {
        res.status(404).json({
          status: 404,
          message: "User doesn't exist",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "User Successfully Updated",
        data: {
          username: user.username,
          email: user.email,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(
    req,
    res,
    next
  ) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.user.id });
      if (!user)
        if (!user) {
          res.status(404).json({
            status: 404,
            message: "User doesn't exist",
          });
          return;
        }

      res.status(200).json({
        status: 200,
        message: "User deleted successfully",
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;