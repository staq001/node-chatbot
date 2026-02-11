const API_BASE_URL = "/api/v1";

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

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("email", data.data.email);

      window.location.href = "/";
    } catch (error) {
      errorDiv.textContent = "Network error. Please try again.";
      console.error("Login error:", error);
    }
  });

window.addEventListener("load", () => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/";
  }
});
