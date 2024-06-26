import React, { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import { message, Table, AutoComplete, Button, Input } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { getAllExams } from "../apicalls/exams";
import { getLeaderboards } from "../apicalls/reports";
import "../stylesheets/custom-components.css";
import { RiMedalLine, RiMedal2Line} from 'react-icons/ri';

function App() {
  const [quiz, setQuiz] = useState([]);
  const [filters, setFilters] = useState({
    examName: "ไม่โหลด",
    userName: "",
  });
  const [setofResults, setSetofResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredExamNames, setFilteredExamNames] = useState([]);
  const dispatch = useDispatch();
 
  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Rank</div>,
      dataIndex: "rank",
      render: (text, record, index) => {
        switch (index) {
          case 0:
            return <div style={{ textAlign: 'center' }}>
                      <RiMedalLine style={{ color: 'gold' }} />
                   </div>;
          case 1:
            return <div style={{ textAlign: 'center' }}>
                      <RiMedal2Line style={{ color: 'silver' }} />
                   </div>;
          case 2:
            return <div style={{ textAlign: 'center' }}>
                        <RiMedal2Line style={{ color: '#b08d57' }} />
                   </div>;
          default:
            return <div style={{ textAlign: 'center' }}>{index + 1}</div>;
        }
      },
    },
    {
      title:<div style={{ textAlign: 'center' }}>Username</div>, 
      dataIndex: "userName",
      render: (text, record) => <div style={{ textAlign: 'center' }}>{record.user.name}</div>,
    },
    {
      title:<div style={{ textAlign: 'center' }}>Score</div>, 
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <div style={{ textAlign: 'center' }}>
          {record.result.correctAnswers.length}/{record.exam.totalMarks}
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Duration</div>,
      dataIndex: "timeUsed",
      render: (text, record) => {
        if (record.exam.duration === null) {
          return <div style={{ textAlign: 'center' }}>-</div>;
        }
        const timeUsed = record.result.timeUsed;
        const minutes = ("0" + Math.floor(timeUsed / 60)).slice(-2);
        const seconds = ("0" + (timeUsed % 60)).slice(-2);
        return (
          <div style={{ textAlign: 'center' }}>
            {minutes}:{seconds}
          </div>
        );
      },
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

  const updateSelect = (value) => {
    setFilters({ ...filters, examName: value });
    getData({ ...filters, examName: value });
  };

  const handleSearch = () => {
    let examNameToSearch = searchInput.trim();
    if (examNameToSearch === "" && filters.examName !== "ไม่โหลด") {
      examNameToSearch = filters.examName;
    }
    getData({ examName: examNameToSearch, userName: filters.userName });
  };

  const handleClear = () => {
    setFilters({
      examName: "",
      userName: "",
    });
    setSearchInput("");
    setSetofResults([]);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    filterExamNames(value);
  };

  const filterExamNames = (searchValue) => {
    const filteredNames = quiz.filter((exam) =>
      exam.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredExamNames(filteredNames);
  };

  return (
    <div>
      <PageTitle title="Leaderboard" />
      <div className="divider"></div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <AutoComplete 
          style={{ width: 400, marginRight: 8, marginTop: 8 }}
          options={filteredExamNames.map((exam) => ({
            value: exam.name,
            label: exam.name,
          }))}
          onSelect={(value) => updateSelect(value)}
          onChange={(value) => handleSearchInputChange(value)}
          placeholder=" "
          value={searchInput}
          filterOption={(inputValue, option) =>
            option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
          }
        >
          <Input.Search
            placeholder="Search Exam. . ."
            onSearch={handleSearch}
            onPressEnter={handleSearch}
            className="primary-contained-btn"
            enterButton="Search" 
            />
        </AutoComplete>
        <Button type="primary-contained-button" onClick={handleClear} style={{ marginLeft: 8, marginTop: 8 }}>
          Clear
        </Button>
      </div>

      <div className="grid overflow-y-auto grid-flow-row" style={{ marginTop: 8 }}>
        <Table columns={columns} dataSource={setofResults} />
      </div>
    </div>
  );
}

export default App;
