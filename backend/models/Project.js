const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false // optional - tasks can exist without a linked project
    },
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: { type: Date },
    assignee: { type: String, trim: true }, // email/username for MVP
    description: { type: String, default: '' },
    tags: [{ type: String }],
    image: { type: String, default: '' } // optional URL/path for uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);