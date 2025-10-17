const socket = io();

const start = document.querySelector(".output-you");
const bot = document.querySelector(".output-bot");
const button = document.querySelector("button");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;

button.addEventListener('click', () => {
  recognition.start();
  console.log("starting the microphone");
})

recognition.addEventListener("result", (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;


  start.textContent = text;
  bot.textContent = "Fetching response..."

  socket.emit("chat message", text);
})


recognition.addEventListener("speechend", () => {
  recognition.stop();
})

recognition.addEventListener('error', (e) => {
  bot.textContent = `Error: ${e.error}`;
})

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.cancel();
  synth.speak(utterance);
}

socket.on("bot reply", (reply) => {
  if (!reply) reply = "No answer";
  synthVoice(reply);
  bot.textContent = reply;
})

socket.on("conversation", (reply) => {
  socket.emit("new conversation", reply);
})