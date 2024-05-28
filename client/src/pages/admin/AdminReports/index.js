import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Total time",
      dataIndex: "timeUsed",
      render: (text, record) => (
        <>
          {("0" + Math.floor(record.result.timeUsed / 60)).slice(-2)}:
          {("0" + (record.result.timeUsed % 60)).slice(-2)}
        </>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleClear = () => {
    setFilters({
      examName: "",
      userName: "",
    });
    setReportsData([]);
  };

  const handleSearch = () => {
    getData(filters);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          onKeyPress={handleKeyPress}
        />
        <button className="primary-outlined-btn" onClick={handleClear}>
          Clear
        </button>
        <button className="primary-contained-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-2" />
    </div>
  );
}

export default AdminReports;
