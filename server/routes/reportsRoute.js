const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const router = require("express").Router();

// add report
router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.send({
      message: "Attempt added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports
router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const { examName, userName } = req.body;

    const exams = await Exam.find({
      name: {
        $regex: examName,
      },
    });

    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await User.find({
      name: {
        $regex: userName,
      },
    });

    const matchedUserIds = users.map((user) => user._id);

    const reports = await Report.find({
      exam: {
        $in: matchedExamIds,
      },
      user: {
        $in: matchedUserIds,
      },
    })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "Attempts fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports (sort for leaderboard)
router.post("/get-leaderboards", authMiddleware, async (req, res) => {
  try {
    const { examName, userName } = req.body;

    const exams = await Exam.find({
      name: {
        $regex: examName,
      },
    });

    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await User.find({
      name: {
        $regex: userName,
      },
    });

    const matchedUserIds = users.map((user) => user._id);

    const reports = await Report.find({
      exam: {
        $in: matchedExamIds,
      },
      user: {
        $in: matchedUserIds,
      },
    })
      .populate("exam")
      .populate("user")
      .sort({ "result.marks": -1, "result.timeUsed": 1, createdAt: 1 },); // Sorting uncompleted
    res.send({
      message: "Attempts fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});


// get all reports by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "Attempts fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get reports by exam ID
router.get("/get-reports-by-exam/:examId", async (req, res) => {
  try {
    const reports = await Report.find({ exam: req.params.examId }).populate('user', 'name');
    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
