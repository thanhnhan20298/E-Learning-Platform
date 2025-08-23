const express = require("express");
const router = express.Router();

// Get all lessons
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      grammar: [],
      listening: [],
      vocabulary: [],
    },
  });
});

// Get lesson by ID
router.get("/:id", (req, res) => {
  res.json({
    success: true,
    data: { id: req.params.id, title: "Sample Lesson" },
  });
});

// Save lesson progress
router.post("/:id/progress", (req, res) => {
  res.json({
    success: true,
    message: "Progress saved",
  });
});

module.exports = router;
