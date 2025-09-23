const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", ContactSchema);
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body); // assumes req.body has {name, email, message}
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
