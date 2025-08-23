const express = require("express");
const router = express.Router();

// Get available tests
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      toeic: [],
      ielts: [],
    },
  });
});

// Submit test results
router.post("/:testId/submit", (req, res) => {
  res.json({
    success: true,
    data: {
      score: 85,
      percentage: 85,
      recommendations: [],
    },
  });
});

module.exports = router;
