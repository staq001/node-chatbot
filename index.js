const express = require("express");
const http = require("http")
const sock = require("./src/io");

const app = express();
const server = http.createServer(app);
const io = sock(server);

require("./db/mongoose");

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
})

server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

