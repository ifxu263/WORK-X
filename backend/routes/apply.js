const express = require('express');
const Application = require('../models/Application');
const router = express.Router();

router.post('/', async (req, res) => {
  const app = await Application.create(req.body);
  res.status(201).json({ message: "Applied!", data: app });
});

module.exports = router;
