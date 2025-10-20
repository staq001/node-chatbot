const express = require("express")
const http = require("http")
const morgan = require("morgan");
const helmet = require("helmet")
const cors = require("cors");
const { rateLimit } = require("express-rate-limit")

// require("./db/mongoose");
const sock = require("./src/io");
const convoRouter = require("./routes/conversation");
const app = express();
const server = http.createServer(app);
const io = sock(server);

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP. Please try again after 15 minutes",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 60,
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan("tiny"));
app.use(limiter);

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.use("/api/v1", convoRouter);

app.get("/", (req, res) => {
  res.sendFile("index.html");
})

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: `Sorry, this route ${req.method} /${req.protocol}://${req.get("host")}${req.originalUrl
      } doesn't exist.`,
  });
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    error: err.message || "Internal Server Error",
  });
});

const s = server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.debug(`SIGTERM signal received: closing HTTP server`);
  s.close(() => {
    console.debug("HTTP server closed");
  });
});
