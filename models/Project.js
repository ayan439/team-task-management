import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Project ||
  mongoose.model('Project', projectSchema)