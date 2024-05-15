const router = require("express").Router();
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Question = require("../models/questionModel");

// add exam
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // check if exam already exists
    const examExists = await Exam.findOne({ name: req.body.name });
    if (examExists) {
      return res
        .status(200)
        .send({ message: "ล้มเหลว", success: false });
    }
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();
    res.send({
      message: "เพิ่มควิซสำเร็จ",
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

// get all exams
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.send({
      message: "ดึงข้อมูล",
      data: exams,
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

// get exam by id
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId) // ใช้ examId จาก req.body ในการค้นหาข้อมูล
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "ดึงข้อมูล",
      data: exam,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลแบบทดสอบ",
      error: error.message,
      success: false,
    });
  }
});

// edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.send({
      message: "แก้ไขสำเร็จ",
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

// delete exam by id
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.body.examId);
    await Question.deleteMany({exam : req.body.examId}); // delete all questions in exam
    res.send({
      message: "ลบควิซแล้ว",
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

// add question to exam

router.post("/add-question-to-exam", authMiddleware, async (req, res) => {
  try {
    // add question to Questions collection
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    // add question to exam
    const exam = await Exam.findById(req.body.exam);
    exam.questions.push(question._id);
    await exam.save();
    res.send({
      message: "เพิ่มคำถามสำเร็จ",
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

// edit question in exam
router.post("/edit-question-in-exam", authMiddleware, async (req, res) => {
  try {
    // edit question in Questions collection
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    res.send({
      message: "แก้ไขคำถามแล้ว",
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


// delete question in exam
router.post("/delete-question-in-exam", authMiddleware, async (req, res) => {
     try {
        // delete question in Questions collection
        await Question.findByIdAndDelete(req.body.questionId);

        // delete question in exam
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
          (question) => question._id != req.body.questionId
        );
        await exam.save();
        res.send({
          message: "ลบคำถามสำเร็จ",
          success: true,
        });
     } catch (error) {

     }
});


module.exports = router;
