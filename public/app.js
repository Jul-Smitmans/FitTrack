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

// Temporary login interaction. We will replace this with real login soon.
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

  workoutMessage.textContent = "Saving workout...";

  try {
    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // Sends the login token so the backend knows who owns this workout.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, scheduledDate, notes }),
    });

    const data = await response.json();

    if (!response.ok) {
      workoutMessage.textContent = data.message;
      return;
    }

    workoutForm.reset();

workoutFormView.classList.add("hidden");
dashboardView.classList.remove("hidden");

// Refreshes the Today’s Workout card using the newly saved data.
loadTodayWorkout();
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

    // Finds the first saved workout whose scheduled date is today.
    const todaysWorkout = data.workouts.find((workout) => {
      return workout.scheduledDate.split("T")[0] === today;
    });

    if (todaysWorkout) {
  todayWorkoutTitle.textContent = todaysWorkout.title;
  todayWorkoutDescription.textContent =
    todaysWorkout.notes || "You have a workout planned for today.";

  if (todaysWorkout.completed) {
    completeWorkoutButton.classList.add("hidden");
    todayWorkoutDescription.textContent += " Completed.";
  } else {
    completeWorkoutButton.dataset.workoutId = todaysWorkout._id;
    completeWorkoutButton.classList.remove("hidden");
  }
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
details.append(title, date);
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