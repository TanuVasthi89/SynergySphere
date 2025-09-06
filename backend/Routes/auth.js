const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, jobTitle = '', department = '' } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existing) return res.status(400).json({ message: 'Email or username already in use' });

    const user = await User.create({ username, email, password, jobTitle, department });

    const payloadUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      jobTitle: user.jobTitle,
      department: user.department
    };

    return res.status(201).json({ message: 'User created', user: payloadUser });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const matched = await user.comparePassword(password);
    if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    const payloadUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      jobTitle: user.jobTitle,
      department: user.department
    };

    return res.json({ message: 'Authenticated', token, user: payloadUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;