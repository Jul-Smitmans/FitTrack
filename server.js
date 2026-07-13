const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Allows the backend to read JSON data sent by the frontend.
app.use(express.json());

// Makes the public folder available in the browser.
app.use(express.static("public"));

// Temporary route: receives the login request from app.js.
app.post("/api/login", (request, response) => {
  const { email } = request.body;

  response.json({
    message: `The server received a login request for ${email}.`,
  });
});

// Connects to MongoDB before starting the web server.
async function startServer() {
  try {
    // Reads the private connection string from the .env file.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB Atlas");

    // Starts FitTrack only after the database connection succeeds.
    app.listen(PORT, () => {
      console.log(`FitTrack is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas:");
    console.error(error.message);
  }
}

startServer();