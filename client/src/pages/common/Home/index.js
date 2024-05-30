import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Select, Col, message, Row, Pagination, Input } from "antd";
const { Option } = Select;

function Home() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.users);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
        setFilteredExams(response.data); // ตั้งค่าเริ่มต้นของ filteredExams
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  useEffect(() => {
    filterExams();
  }, [searchTerm, selectedCategory, selectedMode]);

  const filterExams = () => {
    let filtered = exams;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((exam) => exam.category === selectedCategory);
    }

    if (selectedMode !== "All") {
      if (selectedMode === "No timer") {
        filtered = filtered.filter((exam) => exam.duration === null);
      } else if (selectedMode === "Timer") {
        filtered = filtered.filter((exam) => exam.duration !== null);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter((exam) =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExams(filtered);
  };

  const formatDuration = (duration, mode) => {
    if (duration === null) return "-";

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${hours > 0 ? `${hours} hrs ` : ""}${minutes} min ${seconds} sec`;
  };

  const totalCards = filteredExams.length;
  const cardsPerPage = 24;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredExams.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSelectedMode("All");
    setSelectedCategory("All");
    setSearchTerm(''); // ล้างค่าในช่องที่ให้พิม Exam name
    setFilteredExams(exams); // รีเซ็ต filteredExams
    setCurrentPage(1); // รีเซ็ตหน้าเว็บไปที่หน้าแรก
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      filterExams();
    }
  };

  return (
    user && (
      <div>
        <PageTitle title={`All exam in quizuzz!`} />
        <div className="divider"></div>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={10} lg={6} xl={6}>
            <Input
              placeholder="Exam name. . ."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Select
              value={selectedMode}
              style={{ width: "100%" }}
              onChange={(value) => setSelectedMode(value)}
            >
              <Option value="All">All Mode</Option>
              <Option value="Timer">Timer</Option>
              <Option value="No timer">No timer</Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Select
              value={selectedCategory}
              style={{ width: "100%" }}
              onChange={(value) => setSelectedCategory(value)}
            >
              <Option value="All">All Category</Option>
              <Option value="Knowledge">Knowledge</Option>
              <Option value="Entertainment">Entertainment</Option>
              <Option value="Game">Game</Option>
            </Select>
          </Col>
          <Col xs={24} sm={16} md={8} lg={4} xl={3}>
            <button className="primary-contained-btn" onClick={handleClearFilters}>Clear</button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          {currentCards.map((exam) => (
            <Col xs={24} sm={12} md={12} lg={6} key={exam._id}>
              <div className="card-lg flex flex-col gap-1 p-2">
                <h1 className="text-2xl">{exam?.name}</h1>
                <h1 className="text-md">Mode : {exam.mode}</h1>
                <h1 className="text-md">Category : {exam.category}</h1>
                <h1 className="text-md">Total Marks : {exam.totalMarks}</h1>
                <h1 className="text-md">Passing Marks : {exam.passingMarks}</h1>
                <h1 className="text-md">Duration : {formatDuration(exam.duration, exam.mode)}</h1>
                <button
                  className="primarya-outlined-btn"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
              </div>
            </Col>
          ))}
        </Row>
        <Pagination
          current={currentPage}
          total={totalCards}
          pageSize={cardsPerPage}
          onChange={handlePageChange}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    )
  );
}

export default Home;
