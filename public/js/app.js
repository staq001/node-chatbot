const io = window.io

const token = localStorage.getItem("token")
if (!token) {
  window.location.href = "/login"
}

const socket = io({
  auth: {
    token: token,
  },
})

const start = document.querySelector(".output-you")
const bot = document.querySelector(".output-bot")
const button = document.querySelector("#mic-button")
const themeToggle = document.querySelector("#theme-toggle")

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const recognition = new SpeechRecognition()

recognition.lang = "en-US"
recognition.interimResults = false

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error)
  if (error.message === "Unauthorized") {
    // Token expired or invalid, redirect to auth
    localStorage.clear()
    window.location.href = "/login"
  }
  bot.textContent = "Server connection failed"
})

socket.on("disconnect", () => {
  console.log("Socket disconnected")
})

socket.on("connect", () => {
  console.log("Socket connected successfully")
})

function initializeDarkMode() {
  const isDarkMode = localStorage.getItem("darkMode") === "true"
  if (isDarkMode) {
    document.documentElement.classList.add("dark-mode")
  }
}

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-mode")
  const isDarkMode = document.documentElement.classList.contains("dark-mode")
  localStorage.setItem("darkMode", isDarkMode)
})

initializeDarkMode()

button.addEventListener("click", () => {
  if (!socket.connected) {
    bot.textContent = "Not connected to server. Please check your server."
    return
  }

  const freshRecognition = new SpeechRecognition()
  freshRecognition.lang = "en-US"
  freshRecognition.interimResults = false

  freshRecognition.start()
  button.style.opacity = "0.7"
  console.log("Starting microphone")

  freshRecognition.addEventListener("result", (e) => {
    const last = e.results.length - 1
    const text = e.results[last][0].transcript

    start.textContent = text
    bot.textContent = "Fetching response..."


    const id = sessionStorage.getItem("convo_id");
    console.log(id);
    socket.emit("chat message", [text, id])
  })

  freshRecognition.addEventListener("speechend", () => {
    freshRecognition.stop()
    button.style.opacity = "1"
  })

  freshRecognition.addEventListener("error", (e) => {
    bot.textContent = `Error: ${e.error}`
    button.style.opacity = "1"
  })
})

recognition.addEventListener("result", (e) => {
  const last = e.results.length - 1
  const text = e.results[last][0].transcript

  start.textContent = text
  bot.textContent = "Fetching response..."

  socket.emit("chat message", text)
})

recognition.addEventListener("speechend", () => {
  recognition.stop()
  button.style.opacity = "1"
})

recognition.addEventListener("error", (e) => {
  bot.textContent = `Error: ${e.error}`
  button.style.opacity = "1"
})

function synthVoice(text) {
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance()
  utterance.text = text
  synth.cancel()
  synth.speak(utterance)
}

socket.on("bot reply", (reply) => {
  const [response, id] = reply;
  console.log(response, id);

  if (!response) response = "No answer"
  synthVoice(response)
  bot.textContent = response
  sessionStorage.setItem("convo_id", id);
})

// Messages button handler
const messagesBtn = document.getElementById("messages-btn");
if (messagesBtn) {
  messagesBtn.addEventListener("click", () => {
    window.location.href = "/messages";
  });
}

// Logout button handler
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  });
}