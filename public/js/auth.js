const API_BASE_URL = "/api/v1";

function switchForm(formType) {
  const loginWrapper = document.getElementById("login-form-wrapper");
  const signupWrapper = document.getElementById("signup-form-wrapper");

  if (formType === "signup") {
    loginWrapper.classList.remove("active");
    signupWrapper.classList.add("active");
  } else {
    signupWrapper.classList.remove("active");
    loginWrapper.classList.add("active");
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");

    errorDiv.textContent = "";

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorDiv.textContent = data.message || "Login failed. Please try again.";
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("email", data.data.email);

      // Redirect to main app
      window.location.href = "/";
    } catch (error) {
      errorDiv.textContent = "Network error. Please try again.";
      console.error("Login error:", error);
    }
  });

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

    // Validate passwords match
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

      // Auto-login after signup
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
        errorDiv.textContent = "Account created! Please log in.";
        setTimeout(() => switchForm("login"), 2000);
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
