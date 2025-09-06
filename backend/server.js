const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Routes ---
const authRouter = require('./Routes/auth');
app.use('/api/auth', authRouter);

// tasks router (ensure plural)
const tasksRouter = require('./Routes/tasks');
app.use('/api/tasks', tasksRouter);

// health route
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// connect & start
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/odoo';

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });