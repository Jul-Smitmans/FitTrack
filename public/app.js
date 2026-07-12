const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
  // Prevents the browser from reloading when the form is submitted.
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  loginMessage.textContent = "Sending login request...";

  try {
    // Sends the entered data from the frontend to the backend.
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        // Tells the backend that we are sending JSON data.
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // Converts the backend's JSON answer into JavaScript data.
    const data = await response.json();

    // Shows the backend's message in the browser.
    loginMessage.textContent = data.message;
  } catch (error) {
    // Runs if the frontend cannot reach the backend.
    loginMessage.textContent = "Something went wrong. Please try again.";
  }
});