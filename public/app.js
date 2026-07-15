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

  loginMessage.textContent = "Sending login request...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    loginMessage.textContent = data.message;
  } catch (error) {
    loginMessage.textContent = "Something went wrong. Please try again.";
  }
});
registerForm.addEventListener("submit", async (event) => {
  // Prevents the browser from refreshing the page.
  event.preventDefault();

  const name = document.querySelector("#register-name").value;
  const email = document.querySelector("#register-email").value;
  const password = document.querySelector("#register-password").value;

  registerMessage.textContent = "Creating your account...";

  try {
    // Sends the registration data to the backend.
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    // Reads the backend's JSON response.
    const data = await response.json();

    // Shows an error message if the backend rejected the request.
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
