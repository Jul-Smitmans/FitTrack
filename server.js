const Workout = require("./models/Workout");

const jwt = require("jsonwebtoken");

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const app = express();
const PORT = 3000;
function authenticateToken(request, response, next) {
  const authorizationHeader = request.headers.authorization;
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({
      message: "Please log in to access workouts.",
    });
  }

  try {
    // Verifies the token and gets the user ID stored inside it.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    request.userId = decodedToken.userId;
    next();
  } catch (error) {
    response.status(403).json({
      message: "Your login session has expired. Please log in again.",
    });
  }
}

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

// Verifies the user's credentials and creates a login token.
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

    // Creates a signed token that identifies this user for later requests.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    response.json({
      message: `Hi, ${user.name}! Welcome back.`,
      token,
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


app.post("/api/workouts", authenticateToken, async (request, response) => {
  const { title, scheduledDate, notes } = request.body;

  if (!title || !scheduledDate) {
    return response.status(400).json({
      message: "Workout title and date are required.",
    });
  }

  try {
    const workout = await Workout.create({
      user: request.userId,
      title,
      scheduledDate,
      notes,
    });

    response.status(201).json({
      message: "Workout created successfully.",
      workout,
    });
  } catch (error) {
    console.error("Workout creation error:", error.message);
    response.status(500).json({
      message: "Unable to create the workout. Please try again.",
    });
  }
});
app.get("/api/workouts", authenticateToken, async (request, response) => {
  try {
    // Finds only workouts belonging to the logged-in user.
    const workouts = await Workout.find({
      user: request.userId,
    }).sort({ scheduledDate: 1 });

    response.json({ workouts });
  } catch (error) {
    console.error("Workout loading error:", error.message);
    response.status(500).json({
      message: "Unable to load workouts. Please try again.",
    });
  }
});
app.patch(
  "/api/workouts/:id/complete",
  authenticateToken,
  async (request, response) => {
    try {
      // Updates only a workout that belongs to the logged-in user.
      const workout = await Workout.findOneAndUpdate(
        {
          _id: request.params.id,
          user: request.userId,
        },
        { completed: true },
        { new: true }
      );

      if (!workout) {
        return response.status(404).json({
          message: "Workout not found.",
        });
      }

      response.json({
        message: "Workout marked as complete.",
        workout,
      });
    } catch (error) {
      console.error("Workout completion error:", error.message);
      response.status(500).json({
        message: "Unable to update the workout. Please try again.",
      });
    }
  }
);
app.delete("/api/workouts/:id", authenticateToken, async (request, response) => {
  try {
    // Deletes only a workout owned by the logged-in user.
    const workout = await Workout.findOneAndDelete({
      _id: request.params.id,
      user: request.userId,
    });

    if (!workout) {
      return response.status(404).json({
        message: "Workout not found.",
      });
    }

    response.json({
      message: "Workout deleted successfully.",
    });
  } catch (error) {
    console.error("Workout deletion error:", error.message);
    response.status(500).json({
      message: "Unable to delete the workout. Please try again.",
    });
  }
});
startServer();
