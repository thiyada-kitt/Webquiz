import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Select, Row, Col, Button } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getReportsByExam } from "../../../apicalls/reports";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

function MyExamReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { examId, examName } = useParams();  
  const initialFilters = {
    verdict: "All",
  };
  const [filters, setFilters] = useState(initialFilters);
  
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      render: (text, record) => <>{record.user.name}</>,
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
      title: "Duration",
      dataIndex: "timeUsed",
      render: (text, record) => {
        const timeUsed = record.result.timeUsed;
        if (timeUsed === null) {
          return "-";
        }
        const minutes = ("0" + Math.floor(timeUsed / 60)).slice(-2);
        const seconds = ("0" + (timeUsed % 60)).slice(-2);
        return (
          <>
            {minutes}:{seconds}
          </>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    }
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getReportsByExam(examId);
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

  useEffect(() => {
    if (examId) {
      getData();
    }
  }, [examId]);

  const handleVerdictChange = (value) => {
    setFilters({ ...filters, verdict: value });
  };

  const filteredReports = reportsData.filter((report) => {
    if (filters.verdict !== "All") {
      return report.result.verdict === filters.verdict;
    }
    return true;
  });

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <PageTitle title={`Report in Exam`} />
        </Col>
        <Col>
          <Select
            value={filters.verdict}
            style={{ width: 120 }}
            onChange={handleVerdictChange}
          >
            <Option value="All">All Verdicts</Option>
            <Option value="Pass">Pass</Option>
            <Option value="Fail">Fail</Option>
          </Select>
          <Button className="primary-contained-btn" onClick={() => navigate("/admin/exams")} style={{ marginLeft: 10 }}>
            Back to exam
          </Button>
        </Col>
      </Row>
      <div className="divider"></div>
      <Table columns={columns} dataSource={filteredReports} className="mt-2" rowKey={(record) => record._id} />
    </div>
  );
}

export default MyExamReports;
