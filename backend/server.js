const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Project Schema & Model ---
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    members: [{ type: String, trim: true }],
    startDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', ProjectSchema);

// --- Routes ---
try {
  const authRouter = require('./Routes/auth');
  app.use('/api/auth', authRouter);
} catch (e) {
  console.warn('Auth router not found or failed to load:', e.message);
}

// health route
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Projects CRUD (uses :_id param correctly)
app.get('/api/projects/:_id', async (req, res) => {
  try {
    const project = await Project.findById(req.params._id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: 'Invalid project ID' });
  }
});

app.put('/api/projects/:_id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/projects/:_id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params._id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid project ID' });
  }
});

// --- Connect & Start ---
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/synergysphere';

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });