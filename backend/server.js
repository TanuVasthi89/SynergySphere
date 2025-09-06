const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



// --- Auth Routes
const authRouter = require('./Routes/auth');
app.use('/api/auth', authRouter);

// --- Routes ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState });
});

// Create a project
app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all projects
app.get('/api/projects', async (_req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// --- Connect to MongoDB & Start Server ---
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });