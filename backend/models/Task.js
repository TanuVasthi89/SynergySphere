const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false
    },
    projectName: { type: String, trim: true }, // optional when UI only provides a name
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: { type: Date },
    assignee: { type: String, trim: true }, // email/username for MVP
    description: { type: String, default: '' },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);