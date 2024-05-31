import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Select, Button } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getReportsByExam } from "../../../apicalls/reports";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function MyExamReports({ examId, exam, examName }) {
  const [reportsData, setReportsData] = useState([]);
  const [verdictFilter, setVerdictFilter] = useState("All");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
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
    }
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        if (!examId) return; // ตรวจสอบว่า examId ไม่ใช่ undefined หรือ null
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
    getData();
  }, [dispatch, examId]);

  const handleVerdictChange = (value) => {
    setVerdictFilter(value);
  };

  const filteredReports = reportsData.filter((report) => {
    if (verdictFilter !== "All") {
      return report.result.verdict === verdictFilter;
    }
    return true;
  });

  return (
    <div>
      <div className="flex gap-2 flex justify-between mt-2 items-end">
        <PageTitle title={`Report in ${examName}`} />
        <Select defaultValue="All" onChange={handleVerdictChange} style={{ width: 150 }}>
          <Option value="All">All Verdicts</Option>
          <Option value="Pass">Pass</Option>
          <Option value="Fail">Fail</Option>
        </Select>
        <Button className="primary-contained-btn" onClick={() => navigate("/user/exams")} style={{ marginRight: "auto" }}>Back to exam</Button>
      </div>
      <div className="divider"></div>
      <Table columns={columns} dataSource={filteredReports} rowKey={(record) => record._id} />
    </div>
  );
}

export default MyExamReports;
