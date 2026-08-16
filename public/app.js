const exerciseNameInput = document.querySelector("#exercise-name");
const exerciseSetsInput = document.querySelector("#exercise-sets");
const exerciseRepsInput = document.querySelector("#exercise-reps");
const addExerciseButton = document.querySelector("#add-exercise-button");
const exerciseMessage = document.querySelector("#exercise-message");
const plannedExercisesList = document.querySelector(
  "#planned-exercises-list"
);
const emptyExercisesMessage = document.querySelector(
  "#empty-exercises-message"
);

// Temporarily holds exercises while the user builds the workout.
let plannedExercises = [];

const appContainer = document.querySelector("#app");

const workoutsList = document.querySelector("#workouts-list");

const completeWorkoutButton = document.querySelector(
  "#complete-workout-button"
);

const todayWorkoutTitle = document.querySelector("#today-workout-title");
const todayWorkoutDescription = document.querySelector(
  "#today-workout-description"
);

const workoutForm = document.querySelector("#workout-form");
const workoutMessage = document.querySelector("#workout-message");

const workoutFormView = document.querySelector("#workout-form-view");
const planWorkoutButton = document.querySelector("#plan-workout-button");
const cancelWorkoutButton = document.querySelector("#cancel-workout-button");
const workoutDateInput = document.querySelector("#workout-date");

const logoutButton = document.querySelector("#logout-button");

const dashboardView = document.querySelector("#dashboard-view");
const welcomeHeading = document.querySelector("#welcome-heading");
const todayDate = document.querySelector("#today-date");

const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#register-message");

const loginView = document.querySelector("#login-view");
const registerView = document.querySelector("#register-view");

const showRegisterButton = document.querySelector("#show-register");
const showLoginButton = document.querySelector("#show-login");

const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
async function restoreSession() {
  const token = sessionStorage.getItem("fittrackToken");

  // Without a saved token, FitTrack keeps showing the login screen.
  if (!token) {
    return;
  }

  try {
    // Asks the backend whether the saved token is still valid.
    const response = await fetch("/api/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      sessionStorage.removeItem("fittrackToken");
      sessionStorage.removeItem("fittrackUser");
      return;
    }

    const data = await response.json();

    // Saves the fresh, safe user information returned by the backend.
    sessionStorage.setItem(
      "fittrackUser",
      JSON.stringify(data.user)
    );

    welcomeHeading.textContent =
      `Hi, ${data.user.name}! Welcome back.`;

    const currentDate = new Date();

    todayDate.textContent = currentDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    // Restores the correct SPA view.
    loginView.classList.add("hidden");
    registerView.classList.add("hidden");
    workoutFormView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    appContainer.classList.remove("auth-background");

    loadTodayWorkout();
    loadWorkouts();
  } catch (error) {
    console.error("Unable to restore session:", error.message);
    loginMessage.textContent =
      "Unable to restore your session. Please log in again.";
  }
}
// Shows the registration view and hides the login view.
showRegisterButton.addEventListener("click", () => {
  loginView.classList.add("hidden");
  registerView.classList.remove("hidden");
});

// Shows the login view and hides the registration view.
showLoginButton.addEventListener("click", () => {
  registerView.classList.add("hidden");
  loginView.classList.remove("hidden");
});

// Logs in the user and opens the personalized dashboard.
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  loginMessage.textContent = "Checking your details...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.message;
      return;
    }
    // Keeps the user signed in while this browser tab remains open.
sessionStorage.setItem("fittrackToken", data.token);
sessionStorage.setItem("fittrackUser", JSON.stringify(data.user));

    // Uses the name returned by the backend for the personalized greeting.
    welcomeHeading.textContent = `Hi, ${data.user.name}! Welcome back.`;

    // Gets the real date from the user's device.
    const currentDate = new Date();
    todayDate.textContent = currentDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    loginForm.reset();
    loginMessage.textContent = "";

    // SPA navigation: changes views without opening another HTML page.
    loginView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    appContainer.classList.remove("auth-background");
    loadTodayWorkout();
    loadWorkouts();
  } catch (error) {
    loginMessage.textContent = "Something went wrong. Please try again.";
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("#register-name").value;
  const email = document.querySelector("#register-email").value;
  const password = document.querySelector("#register-password").value;

  registerMessage.textContent = "Creating your account...";

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      registerMessage.textContent = data.message;
      return;
    }

    registerMessage.textContent = data.message;

    // Clears the form after successful registration.
    registerForm.reset();
  } catch (error) {
    registerMessage.textContent = "Something went wrong. Please try again.";
  }
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("fittrackToken");
sessionStorage.removeItem("fittrackUser");
  // Shows the login screen again and hides the private dashboard.
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  appContainer.classList.add("auth-background");
});

planWorkoutButton.addEventListener("click", () => {
  dashboardView.classList.add("hidden");
  workoutFormView.classList.remove("hidden");

  // Pre-fills the date field with today's date.
  workoutDateInput.value = new Date().toISOString().split("T")[0];
});

cancelWorkoutButton.addEventListener("click", () => {
  workoutFormView.classList.add("hidden");
  dashboardView.classList.remove("hidden");

});
workoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = sessionStorage.getItem("fittrackToken");

  if (!token) {
    workoutMessage.textContent = "Please log in again.";
    return;
  }

  const title = document.querySelector("#workout-title").value;
  const scheduledDate = workoutDateInput.value;
  const notes = document.querySelector("#workout-notes").value;

  if (plannedExercises.length === 0) {
    workoutMessage.textContent =
      "Add at least one exercise before saving the workout.";
    return;
  }

  workoutMessage.textContent = "Saving workout...";

  try {
    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // Sends the login token so the backend knows who owns this workout.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        scheduledDate,
        notes,
        exercises: plannedExercises,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      workoutMessage.textContent = data.message;
      return;
    }

    workoutForm.reset();

    // Clears the temporary exercise state after the workout is saved.
    plannedExercises = [];
    renderPlannedExercises();
    exerciseMessage.textContent = "";

workoutFormView.classList.add("hidden");
dashboardView.classList.remove("hidden");

// Refreshes the Today’s Workout card using the newly saved data.
loadTodayWorkout();
loadWorkouts();
  } catch (error) {
    workoutMessage.textContent = "Something went wrong. Please try again.";
  }
});
async function loadTodayWorkout() {
  const token = sessionStorage.getItem("fittrackToken");

  if (!token) {
    return;
  }

  try {
    const response = await fetch("/api/workouts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const today = new Date().toISOString().split("T")[0];

    // Finds every workout for today, then selects the newest one.
    const todaysWorkout = data.workouts
      .filter((workout) => {
        return workout.scheduledDate.split("T")[0] === today;
      })
      .sort((firstWorkout, secondWorkout) => {
        return (
          new Date(secondWorkout.createdAt) -
          new Date(firstWorkout.createdAt)
        );
      })[0];

    if (todaysWorkout) {
      todayWorkoutTitle.textContent = todaysWorkout.title;

      // Converts every structured exercise into one readable line.
      const exerciseLines = (todaysWorkout.exercises || [])
        .map((exercise) => {
          return `${exercise.name} — ${exercise.sets} sets × ${exercise.reps} reps`;
        })
        .join("\n");

      const workoutDetails = [];

      if (todaysWorkout.notes) {
        workoutDetails.push(todaysWorkout.notes);
      }

      if (exerciseLines) {
        workoutDetails.push(exerciseLines);
      } else {
        // Keeps older workouts without an exercises array readable.
        workoutDetails.push("No structured exercises saved.");
      }

      if (todaysWorkout.completed) {
        workoutDetails.push("Status: Completed");
        completeWorkoutButton.classList.add("hidden");
      } else {
        completeWorkoutButton.dataset.workoutId = todaysWorkout._id;
        completeWorkoutButton.textContent = "Mark as complete";
        completeWorkoutButton.classList.remove("hidden");
      }

      todayWorkoutDescription.textContent = workoutDetails.join("\n");
    } else {
      todayWorkoutTitle.textContent = "No workout planned";
      todayWorkoutDescription.textContent =
        "Create a workout to begin planning your week.";
      completeWorkoutButton.classList.add("hidden");
    }
  } catch (error) {
    todayWorkoutTitle.textContent = "Unable to load today’s workout";
  }
}

completeWorkoutButton.addEventListener("click", async () => {
  const token = sessionStorage.getItem("fittrackToken");
  const workoutId = completeWorkoutButton.dataset.workoutId;

  if (!token || !workoutId) {
    return;
  }

  completeWorkoutButton.textContent = "Saving...";

  try {
    const response = await fetch(
      `/api/workouts/${workoutId}/complete`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      todayWorkoutDescription.textContent = data.message;
      return;
    }

    // Reloads the card so it shows the completed state.
    loadTodayWorkout();
    loadWorkouts();
  } catch (error) {
    todayWorkoutDescription.textContent =
      "Unable to update the workout. Please try again.";
  }
});
async function loadWorkouts() {
  const token = sessionStorage.getItem("fittrackToken");

  if (!token) {
    return;
  }

  try {
    const response = await fetch("/api/workouts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    workoutsList.innerHTML = "";

    if (data.workouts.length === 0) {
      workoutsList.textContent = "No workouts saved yet.";
      return;
    }

    data.workouts.forEach((workout) => {
      const workoutItem = document.createElement("article");
      workoutItem.className = "workout-list-item";

      const details = document.createElement("div");
      const title = document.createElement("h3");
      const date = document.createElement("p");
      const status = document.createElement("p");
      const exerciseList = document.createElement("ul");
      exerciseList.className = "saved-exercise-list";

      title.textContent = workout.title;

      // Formats the database date into a readable date for the user.
      date.textContent = new Date(workout.scheduledDate).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
      const savedExercises = workout.exercises || [];

if (savedExercises.length === 0) {
  const exerciseItem = document.createElement("li");
  exerciseItem.textContent = "No structured exercises saved.";
  exerciseList.append(exerciseItem);
} else {
  savedExercises.forEach((exercise) => {
    const exerciseItem = document.createElement("li");

    exerciseItem.textContent =
      `${exercise.name} — ${exercise.sets} sets × ${exercise.reps} reps`;

    exerciseList.append(exerciseItem);
  });
}

      status.className = "workout-status";
      status.textContent = workout.completed ? "Completed" : "Planned";

      const actions = document.createElement("div");
actions.className = "workout-actions";

const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.className = "delete-button";
deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", () => {
  deleteWorkout(workout._id);
});

actions.append(status, deleteButton);
details.append(title, date, exerciseList);
workoutItem.append(details, actions);
workoutsList.append(workoutItem);
    });
  } catch (error) {
    workoutsList.textContent = "Unable to load workouts.";
  }
}
async function deleteWorkout(workoutId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this workout?"
  );

  if (!confirmed) {
    return;
  }

  const token = sessionStorage.getItem("fittrackToken");

  try {
    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      window.alert(data.message);
      return;
    }

    // Refreshes both dashboard areas after the deletion.
    loadTodayWorkout();
    loadWorkouts();
  } catch (error) {
    window.alert("Unable to delete the workout. Please try again.");
  }
}
// Checks for an existing valid login whenever app.js loads.
restoreSession();

function renderPlannedExercises() {
  plannedExercisesList.innerHTML = "";

  if (plannedExercises.length === 0) {
    emptyExercisesMessage.classList.remove("hidden");
    return;
  }

  emptyExercisesMessage.classList.add("hidden");

  plannedExercises.forEach((exercise, index) => {
    const listItem = document.createElement("li");
    listItem.className = "planned-exercise-item";

    const description = document.createElement("p");
    description.textContent =
      `${exercise.name} — ${exercise.sets} sets × ${exercise.reps} reps`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-exercise-button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      // Removes one exercise using its current array position.
      plannedExercises.splice(index, 1);
      renderPlannedExercises();
    });

    listItem.append(description, removeButton);
    plannedExercisesList.append(listItem);
  });
}
addExerciseButton.addEventListener("click", () => {
  const name = exerciseNameInput.value.trim();
  const sets = Number(exerciseSetsInput.value);
  const reps = Number(exerciseRepsInput.value);

  if (!name) {
    exerciseMessage.textContent = "Enter an exercise name.";
    return;
  }

  if (!Number.isInteger(sets) || sets < 1 || sets > 100) {
    exerciseMessage.textContent =
      "Sets must be a whole number between 1 and 100.";
    return;
  }

  if (!Number.isInteger(reps) || reps < 1 || reps > 1000) {
    exerciseMessage.textContent =
      "Reps must be a whole number between 1 and 1000.";
    return;
  }

  // Adds one structured exercise to the temporary workout array.
  plannedExercises.push({
    name,
    sets,
    reps,
  });

  renderPlannedExercises();

  // Clears only the exercise inputs so another exercise can be added.
  exerciseMessage.textContent = "";
  exerciseNameInput.value = "";
  exerciseSetsInput.value = "";
  exerciseRepsInput.value = "";
  exerciseNameInput.focus();
});
