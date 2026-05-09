import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    status: {
      type: String,
      enum: [
        'pending',
        'in-progress',
        'completed',
        'issue',
      ],
      default: 'pending',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    assignedTo: {
      type: String,
      default: '',
    },

    dueDate: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Task ||
  mongoose.model('Task', taskSchema)