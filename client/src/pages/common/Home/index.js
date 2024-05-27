import { Col, message, Row, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

function Home() {
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // เพิ่ม state เก็บหน้าปัจจุบัน
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
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

  const formatDuration = (duration, mode) => {
    if (duration === null) return '-';
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${hours > 0 ? `${hours} hrs ` : ""}${minutes} min ${seconds} sec`;
  }

  // คำนวณหน้าทั้งหมด
  const totalCards = exams.length;
  const cardsPerPage = 24;
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  // คำนวณ index ของการ์ดแรกและการ์ดสุดท้ายของหน้าปัจจุบัน
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = exams.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (page) => {
    setCurrentPage(page); // เปลี่ยนหน้าปัจจุบันเมื่อมีการเปลี่ยนหน้า
  };

  return (
    user && (
      <div>
        <PageTitle title={`All exam in quizuzz!`} />
        <div className="divider"></div>
        <Row gutter={[16, 16]}>
          {currentCards.map((exam) => (
            <Col span={6} key={exam._id}>
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
        {/* เพิ่ม Pagination ด้านล่าง */}
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
