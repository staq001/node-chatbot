const API_BASE_URL = "/api/v1";

document
  .getElementById("signup-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const errorDiv = document.getElementById("signup-error");

    errorDiv.textContent = "";

    if (password !== confirm) {
      errorDiv.textContent = "Passwords do not match.";
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = "Password must be at least 6 characters long.";
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorDiv.textContent = data.message || "Sign up failed. Please try again.";
        return;
      }

      const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem("token", loginData.data.token);
        localStorage.setItem("username", loginData.data.username);
        localStorage.setItem("email", loginData.data.email);
        window.location.href = "/";
      } else {
        // Redirect to login if auto-login fails
        errorDiv.textContent = "Account created! Redirecting to login...";
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      errorDiv.textContent = "Network error. Please try again.";
      console.error("Sign up error:", error);
    }
  });

// Check if user is already logged in
window.addEventListener("load", () => {
  const token = localStorage.getItem("token");
  if (token) {
    // User already logged in, redirect to main app
    window.location.href = "/";
  }
});
