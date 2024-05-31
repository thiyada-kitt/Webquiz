import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Select, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";

const { Option } = Select;

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const initialFilters = {
    examName: "",
    userName: "",
    verdict: "All",
  };
  const [filters, setFilters] = useState(initialFilters);

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
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
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
    setFilters(initialFilters);
    getData(initialFilters);
  };

  const handleSearch = () => {
    getData(filters);
  };

  useEffect(() => {
    getData(filters);
  }, []);

  // Function to filter reports based on case-insensitive match
  const filteredData = reportsData.filter((report) => {
    const examNameMatch = report.exam.name
      .toLowerCase()
      .includes(filters.examName.toLowerCase());
    const userNameMatch = report.user.name
      .toLowerCase()
      .includes(filters.userName.toLowerCase());
    const verdictMatch =
      filters.verdict === "All" ||
      report.result.verdict.toLowerCase() === filters.verdict.toLowerCase();
    return examNameMatch && userNameMatch && verdictMatch;
  });

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <PageTitle title="All Reports" />
        </Col>
        <Col>
          <Select
            value={filters.verdict}
            style={{ width: 120 }}
            onChange={(value) => setFilters({ ...filters, verdict: value })}
          >
            <Option value="All">All Verdicts</Option>
            <Option value="pass">Pass</Option>
            <Option value="fail">Fail</Option>
          </Select>
        </Col>
      </Row>
      <div className="divider"></div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button className="primary-outlined-btn" onClick={handleClear}>
          Clear
        </button>
      </div>
      <Table columns={columns} dataSource={filteredData} className="mt-2" />
    </div>
  );
}

export default AdminReports;
