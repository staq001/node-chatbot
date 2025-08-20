const socket = io();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;

document.querySelector("button").addEventListener('click', () => {
  recognition.start();
  console.log("starting the microphone");
  console.log(recognition);
})

recognition.addEventListener("result", (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;


  console.log(text);

  socket.emit("chat message", text);

  socket.on("bot reply", (text) => {
    synthVoice(text);
    console.log(text);
  })
})


function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

