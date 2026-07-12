const express = require("express");

const app = express();
const PORT = 3000;

// Allows the backend to understand JSON sent by the frontend.
app.use(express.json());

// Makes files in the public folder available in the browser.
app.use(express.static("public"));

// Receives login data sent to: POST /api/login
app.post("/api/login", (request, response) => {
  // Gets the email from the JSON data sent by the frontend.
  const { email } = request.body;

  // Sends a JSON response back to the frontend.
  response.json({
    message: `The server received a login request for ${email}.`,
  });
});

app.listen(PORT, () => {
  console.log(`FitTrack is running at http://localhost:${PORT}`);
});