import React from "react";
import PageTitle from "../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { getAllExams } from "../apicalls/exams";
import { getLeaderboards } from "../apicalls/reports";
import { useEffect } from "react";

function App() {
  const [quiz, setQuiz] = React.useState([]);
  const [filters, setFilters] = React.useState({
    examName: "ไม่โหลด",
    userName: "",
  });
  const [setofResults, setSetofResults] = React.useState([]); 
  const dispatch = useDispatch();

  const columns = [
    {
      title: "username",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "score",
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <>
          {record.result.correctAnswers.length}/{record.exam.totalMarks}
        </>
      ),
    },
    {
      title: "duration",
      dataIndex: "timeUsed",
      render: (text, record) => (
        <>
          {("0" + Math.floor(record.result.timeUsed / 60)).slice(-2)}:
          {("0" + (record.result.timeUsed % 60)).slice(-2)}
        </>
      ),
    },
  ];

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setQuiz(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const updateSelect = (evt) => {
    setFilters({ ...filters, examName: evt.target.value });
    getData({ ...filters, examName: evt.target.value });
  };

  const getData = async (filters) => {
    let userName = [];
    let information = [];
    try {
      dispatch(ShowLoading());
      const response = await getLeaderboards(filters);
      if (response.success) {
        response.data.forEach((info) => {
          if (!userName.includes(info.user.name)) {
            information.push(info);
            userName.push(info.user.name);
          }
        });
        setSetofResults(information);
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

  return (
    <div>
      <PageTitle title="leaderboard" />
      <div>
        <select onChange={updateSelect}>
          <option selected hidden>
            --- Search ---
          </option>
          {quiz.map((quiz) => (
            <option key={quiz.name} value={quiz.name}>
              {quiz.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid overflow-y-auto grid-flow-row">
        <Table columns={columns} dataSource={setofResults} />
      </div>
    </div>
  );
}

export default App;