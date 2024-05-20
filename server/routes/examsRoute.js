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
        .send({ message: "Exam already exists", success: false });
    }
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();
    res.send({
      message: "Exam added successfully",
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
      message: "Exams fetched successfully",
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
    const exam = await Exam.findById(req.body.examId).populate("questions");
    res.send({
      message: "Exam fetched successfully",
      data: exam,
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

// edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.send({
      message: "Exam edited successfully",
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
      message: "Exam deleted successfully",
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
      message: "Question added successfully",
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
      message: "Question edited successfully",
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
        if (req.body.examID){
          const exam = await Exam.findById(req.body.examId);
          exam.questions = exam.questions.filter(
            (question) => question._id != req.body.questionId
          );
          await exam.save();
        }
        res.send({
          message: "Question deleted successfully",
          success: true,
        });
     } catch (error) {

     }
});

router.post("/fetch-exam-by-userid", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({user: req.body.userId});
    res.send({
      message: "Exams fetched successfully",
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
})

router.post("/addmulti-question-in-exam", authMiddleware, async (req, res) => {
  try {
    const fetchExam = await Exam.find().limit(1).sort({$natural:-1});
    const questions = await Question.updateMany({tempUser: req.body.user},
      {
        $set: {exam: fetchExam[0]._id},
        $unset: {tempUser: req.body.user}
    });
    const fetchQuestion = await Question.find({
      exam: fetchExam[0]._id
    })
    fetchQuestion.map((data) => {
      fetchExam[0].questions.push(data._id);
    })

    await fetchExam[0].save()

    res.send({
      message: "New exam added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
})


router.post("/add-preset-question", authMiddleware, async (req, res) => {
  try {
    // add question to Questions collection
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();

    res.send({
      message: "Question added successfully",
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

router.post("/get-draft-question", authMiddleware, async (req, res) => {
  try {
    // get question drafted
    const response = await Question.find({tempUser: req.body.user})

    res.send({
      message: "Question added successfully",
      data: response,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
})

module.exports = router;
