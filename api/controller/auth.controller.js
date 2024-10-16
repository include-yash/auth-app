import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Signup Controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate that all required fields are present
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: username, email, and password.",
    });
  }

  try {
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    // Check if MongoDB duplicate key error (for existing username/email)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // 'username' or 'email'
      const errorMessage = `An account with that ${field} already exists.`;
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    // Pass other errors to the global error handler
    next(errorHandler(500, "Something went wrong!"));
  }
};

// Signin Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "User not found"));
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!isValidPassword) {
      return next(errorHandler(401, "Invalid password"));
    }

    // Destructure password to avoid sending it in the response
    const { password: hashedPassword, ...rest } = validUser._doc;

    // Generate JWT token
    const token = jwt.sign({ userId: validUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' }); // Set expiration time

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };

    // Set cookie and respond
    res.cookie('access_token', token, cookieOptions).status(200).json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

// Google Sign-in/Sign-up Controller
export const google = async (req, res, next) => {
  const { email, name, photo } = req.body;

  try {
    // Validate request body fields
    if (!email || !name || !photo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, name, or photo.",
      });
    }

    // Find if the user already exists in the database by email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists, generate JWT token
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: hashedPassword, ...rest } = existingUser._doc;

      // Set cookie with token
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry
      return res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        expires: expiryDate,
      }).status(200).json({
        success: true,
        user: rest,
      });
    } else {
      // If user does not exist, create a new user with Google details
      const generatedPassword = Math.random().toString(36).slice(-8); // Generate random password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the generated password

      const newUser = new User({
        username: name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString(), // Generate a username
        email,
        password: hashedPassword,
        profilePicture: photo, // Assuming photo URL is provided by Google
      });

      // Save new user to the database
      await newUser.save();

      // Generate JWT token for new user
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: newUserPassword, ...rest } = newUser._doc;

      // Set cookie with token
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry
      return res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        expires: expiryDate,
      }).status(201).json({
        success: true,
        user: rest,
      });
    }
  } catch (error) {
    console.error("Error during Google authentication:", error);
    next(errorHandler(500, "Google authentication failed."));
  }
};
