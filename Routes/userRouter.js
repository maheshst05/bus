const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../Model/blacklistedModel");
const Bus = require("../Model/busModel")
require("dotenv").config();
const authentication =  require("../Middleware/authentication")
userRouter.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, dob, phoneNo } = req.body;

    // Check if the phone number is already used
    const usernameCheck = await User.findOne({ phoneNo });
    if (usernameCheck) {
      return res
        .status(400)
        .json({ msg: "Phone Number already used", status: false });
    }

    // Check if the email is already used
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      phoneNo,
      dob,
      password: hashedPassword,
    });

    return res.status(201).json({ status: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

userRouter.post("/api/auth/login", async (req, res) => {
  try {
    const { phoneNo, password , grant_type } = req.body;
if( grant_type !=='password' ){
  return res
  .status(400)
  .json({ msg: "Invalid grant_type", status: false });
}

    // Find the user by phone number
    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Invalid credentials", status: false });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ msg: "Invalid credentials", status: false });
    }

    // Generate an access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.RefreshToken,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({
        msg: "login successfully",
        status: true,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

userRouter.post("/api/auth/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token provided", status: false });
    }

    const blacklistedToken = new BlacklistedToken({ token: token });
    await blacklistedToken.save();

    return res.status(200).json({ msg: "You are logged out", status: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

// Define the API endpoint
userRouter.get("/api/get-bus/:id", async (req, res) => {
  try {
    const busId = req.params.id;

    // Fetch the bus information from the database using the provided busId
    const bus = await Bus.findById({_id:busId});

    if (!bus) {
      return res.status(404).json({ msg: "Bus not found", status: false });
    }

    // Construct the response object with the fetched bus information
    const response = {
      id: bus._id,
      busName: bus.busName,
      driver_name: bus.driver_name,
      route: bus.route,
      time: bus.time,
      sourceRoute: bus.sourceRoute,
      destinationRoute: bus.destinationRoute,
      status: bus.status
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});


module.exports = userRouter;
