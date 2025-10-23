const io = window.io
const socket = io()

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