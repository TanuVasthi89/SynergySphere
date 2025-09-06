const express = require('express');
const mongoose = require('mongoose');
//const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/Users');

const router = express.Router();

const FALLBACK_PROJECT_NAME = 'Unassigned Project';

/**
 * POST /api/tasks
 * Create a task. If provided projectId does not exist (or is missing),
 * use / create a hardcoded fallback project and assign the task to it.
 * Body: { projectId?, title, status?, dueDate?, assignee?, description?, tags?, image? }
 */
router.post('/', async (req, res) => {
  try {
    const {
      projectId,
      title,
      status = 'todo',
      dueDate,
      assignee,
      description = '',
      tags = [],
      image = ''
    } = req.body;

    if (!title || !title.toString().trim()) {
      return res.status(400).json({ message: 'title is required' });
    }

    // Resolve / ensure fallback project
    async function getFallbackProject() {
      let fallback = await Project.findOne({ name: FALLBACK_PROJECT_NAME }).lean();
      if (!fallback) {
        // create a deterministic fallback project
        fallback = await Project.create({
          name: FALLBACK_PROJECT_NAME,
          description: 'Fallback project for tasks without a valid projectId',
          status: 'active',
          members: []
        });
      }
      return fallback;
    }

    // Determine final projectId: use provided if valid and exists, otherwise fallback
    let finalProjectId;
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      const proj = await Project.findById(projectId).lean();
      if (proj) {
        finalProjectId = proj._id;
      } else {
        const fallback = await getFallbackProject();
        finalProjectId = fallback._id;
        console.warn('tasks POST: provided projectId not found, using fallback project', projectId);
      }
    } else {
      // no projectId provided or invalid -> use fallback
      const fallback = await getFallbackProject();
      finalProjectId = fallback._id;
    }

    // Resolve assignee to existing user (email preferred)
    let assigneeValue = assignee || '';
    let assigneeUser = null;
    if (assignee) {
      assigneeUser = await User.findOne({
        $or: [{ email: assignee }, { username: assignee }]
      }).select('-password').lean();
      if (assigneeUser) assigneeValue = assigneeUser.email || assigneeUser.username;
    }

    // Normalize tags
    let tagsArray = [];
    if (Array.isArray(tags)) tagsArray = tags.map(t => String(t).trim()).filter(Boolean);
    else if (typeof tags === 'string' && tags.trim()) tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    const taskDoc = {
      projectId: finalProjectId,
      title: title.toString().trim(),
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignee: assigneeValue,
      description,
      tags: tagsArray,
      image: image || ''
    };

    const created = await Task.create(taskDoc);

    return res.status(201).json({
      message: 'Task created',
      task: created,
      assigneeUser: assigneeUser || null
    });
  } catch (err) {
    console.error('Create task error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', (_req, res) => {
  return res.json({ ok: true, route: '/api/tasks/' });
});


module.exports = router;