const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup route (create new user)
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log("Signup attempt:", { name, email, password: password ? "***" : "missing" });
  
  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "All fields are required: name, email, password" 
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already registered:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = await User.create({ name, email, password });
    console.log("User created successfully:", { id: user._id, name: user.name, email: user.email });
    
    res.json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get current user profile (for profile page)
router.get("/profile", async (req, res) => {
  try {
    // For now, we'll return a mock user since we don't have session management
    // In a real app, you'd get the user from the session/token
    const { email } = req.query;
    if (!email) {
      return res.status(401).json({ error: "Email required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update current user profile
router.put("/profile", async (req, res) => {
  const { name, avatar, email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, avatar },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  try {
    // In a real app, you'd invalidate the session/token here
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout error" });
  }
});

// Get User Profile by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update User Profile (name, avatar)
router.put("/profile/:id", async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, avatar },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
