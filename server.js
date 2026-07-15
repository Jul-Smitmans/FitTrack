const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const app = express();
const PORT = 3000;

// Allows the backend to read JSON data sent by the frontend.
app.use(express.json());

// Makes the public folder available in the browser.
app.use(express.static("public"));

// Creates a new user account.
app.post("/api/register", async (request, response) => {
  const { name, email, password } = request.body;

  // Checks that the frontend sent all required values.
  if (!name || !email || !password) {
    return response.status(400).json({
      message: "Name, email, and password are required.",
    });
  }

  try {
    // Checks whether an account already exists with this email.
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return response.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    // Converts the readable password into a secure hash.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Saves the new user in MongoDB.
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Sends safe user information back—never the password or password hash.
    response.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    response.status(500).json({
      message: "Unable to create the account. Please try again.",
    });
  }
});

// Temporary login route. We will replace this with real login next.
app.post("/api/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    // Finds the user account that has this email address.
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return response.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    // Compares the typed password with the secure hash saved in MongoDB.
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return response.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    response.json({
      message: `Hi, ${user.name}! Welcome back.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    response.status(500).json({
      message: "Unable to log in. Please try again.",
    });
  }
});

// Connects to MongoDB before starting the web server.
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`FitTrack is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas:");
    console.error(error.message);
  }
}

startServer();
