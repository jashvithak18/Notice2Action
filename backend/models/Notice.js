import mongoose from 'mongoose';

const deadlineSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const noticeSchema = new mongoose.Schema(
  {
    rawText: { type: String, required: true },
    summary: { type: String, required: true },
    deadlines: [deadlineSchema],
    eligibility: [{ type: String }],
    checklist: [{ type: String }],
    quickTake: {
      deadline: String,
      action: String,
      eligibility: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
