const mongoose = require("mongoose");

// Defines the required structure of every FitTrack user.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // A user must provide a name.
      trim: true, // Removes accidental spaces at the beginning or end.
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevents two accounts using the same email.
      trim: true,
      lowercase: true, // Stores email addresses consistently.
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    // Automatically adds createdAt and updatedAt dates.
    timestamps: true,
  }
);

// Creates the "users" collection model that we use in backend code.
module.exports = mongoose.model("User", userSchema);