const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      /^http:\/\/192\.168\.\d+\.\d+:3000$/, // Allow local network IPs
      /^http:\/\/10\.\d+\.\d+\.\d+:3000$/, // Allow 10.x.x.x network
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:3000$/, // Allow 172.16-31.x.x
    ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/listening", require("./routes/listening"));
app.use("/api/speaking", require("./routes/speaking"));
app.use("/api/tests", require("./routes/tests"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "E-Learn Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 E-Learn Backend API running on port ${PORT}`);
  console.log(`📖 Local: http://localhost:${PORT}/api/health`);
  console.log(`📱 Network: http://0.0.0.0:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
