const router = require("express").Router();
const { genSalt } = require("bcryptjs");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");


// user Registration

router.post("/register", async (req, res) => {
  try {
    //check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      console.log("User already exists:", userExists); // Log user data
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //create new user
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// user login

router.post("/login", async (req, res) => {
  try {
    //check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    // Check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      // Use 'validPassword' here instead of 'User.validPassword'
      return res.status(200).send({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    const isAdmin = user.isAdmin;

    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

//get user info

router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log("User ID in route handler:", userId); // Log the user ID in route handler
    if (!userId) {
      throw new Error("User ID missing in request body");
    }

    const user = await User.findById(userId);
    console.log("Fetched User:", user); // Log the fetched user data
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user and isAdmin property exist
    if (user && user.isAdmin !== undefined) {
      console.log("User isAdmin:", user.isAdmin);
    } else {
      throw new Error("User or isAdmin property is undefined");
    }

    res.send({
      message: "User info fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

//update-profile
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.body.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while updating the profile.' });
  }
});

module.exports = router;
