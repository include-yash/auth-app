import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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
