import React from "react";
import PageTitle from "../components/PageTitle";
import { message, Modal, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { getAllReports, getLeaderboards } from "../apicalls/reports";
import { useEffect } from "react";
import { getAllExams } from "../apicalls/exams";
import {Select} from "antd";


// ต้องมีการ Sort แยกข้อมูลคนรายคน

function App() {
  const [quiz = [], setQuiz] = React.useState([]);
  const [filters, setFilters] = React.useState({ // Make Initial loads with no data fetch
    examName: "ไม่โหลd",
    userName: "",
  });
  const [setofResults = [], setSetofResults] = React.useState([]) // ข้อมูลที่ดึงมา/ยังไม่มีการจัดให้มีความ Unique
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Username",
      dataIndex: "userName", // username
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers", // Score, Marks
      render: (text, record) => <>{record.result.correctAnswers.length}/{record.exam.totalMarks} </>,
    },
    {
      title: "Total time",
      dataIndex: "timeUsed",
      render: (text, record) => <>{("0" + Math.floor(record.result.timeUsed/60)).slice(-2)}:{("0" + record.result.timeUsed%60).slice(-2)}</>,
    }
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
    setFilters({...filters, examName: evt.target.value});
  }
/*
  // Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
(option?.label ?? '').toLowerCase().includes(input.toLowerCase());
*/
  const getData = async () => {
    let userName = []; // Initialize Users
    let information = []; // Information of User to be pushed into array
    try {
      dispatch(ShowLoading());
      const response = await getLeaderboards(filters);
      if (response.success) {
        response.data.forEach((info) => { // จัดให้ข้อมูลของแต่ละคนแสดงผลลัพธ์ที่ดีที่สุด
          if (!userName.includes(info.user.name)) {
            information.push(info);
            userName.push(info.user.name);
          }
        })
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

  const search = () => {
    getData(filters);
  }

  useEffect(() => {
    getExams();
    getData();
  }, []);

    return(
        <div>
            <PageTitle title="Leaderboards"/>
            <div>
              <select onChange={updateSelect}>
                {quiz.map((quiz)=>
                  <option value={quiz.name}>{quiz.name}</option>
                )}
              </select>
              <button onClick={search}>Search</button>
            </div> {/* Filter Box */}
            <Select
                showSearch
                placeholder="--- Select ---"
              />
            <div className="grid overflow-y-auto grid-flow-row">
                {/* ?.map((props) =>) 
                <div className="flex justify-between">
                    <h1 className='text-xl font-bold'>(Rank)</h1>
                    <h1 className='text-xl font-bold'>(Username)</h1>
                    <h1 className='text-xl font-bold'>(Score)</h1>
                    <h1 className='text-xl font-bold'>(Time)</h1>
                </div>Display Plays */}
                <Table columns={columns} dataSource={setofResults} />
            </div>  
        </div>
    )
}

export default App;