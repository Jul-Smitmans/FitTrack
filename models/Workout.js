const mongoose = require("mongoose");
// Defines the structure of one exercise inside a workout.
const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },
  },
  {
    // Exercises are stored inside a workout and do not need separate IDs.
    _id: false,
  }
);

const workoutSchema = new mongoose.Schema(
  {
    // Links each workout to the user who created it.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    exercises: {
  type: [exerciseSchema],
  default: [],
},
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);