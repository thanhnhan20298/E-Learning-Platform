const express = require("express");
const router = express.Router();

// Get user profile
router.get("/profile", (req, res) => {
  res.json({
    success: true,
    data: {
      id: "user123",
      name: "John Doe",
      level: "Intermediate",
      progress: {
        grammar: 65,
        listening: 70,
        vocabulary: 60,
      },
    },
  });
});

// Update user progress
router.put("/progress", (req, res) => {
  res.json({
    success: true,
    message: "Progress updated",
  });
});

module.exports = router;
