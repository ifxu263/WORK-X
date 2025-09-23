const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const contactRoutes = require("./routes/contact");
const applyRoutes = require("./routes/apply");

dotenv.config();
const app = express();

// IMP: Large payloads/images ke liye JSON body size increase!
app.use(express.json({ limit: "10mb" }));

app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"], 
  credentials: true 
}));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/apply", applyRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
  })
  .catch(e => {
    console.error("❌ Mongo connection error", e);
    process.exit(1);
  });

// (Optional) not-found route (should be LAST!)
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});
