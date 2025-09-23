const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// POST /api/jobs -- save new job to MongoDB
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: "Job not saved", details: err.message });
  }
});

// GET /api/jobs -- fetch all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

module.exports = router;
