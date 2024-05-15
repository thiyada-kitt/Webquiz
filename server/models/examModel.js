const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "questions",
      required: true,
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    // },
    // exam: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "exams",
    // },
    // result: {
    //   type: Object,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("exams", examSchema);
module.exports = Exam;
