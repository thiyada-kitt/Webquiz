import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Modal, Table, Select } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";

const { Option } = Select;

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const [verdictFilter, setVerdictFilter] = useState(null); // Add verdictFilter and setVerdictFilter
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
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

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
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
    getData();
  }, []);

  const handleVerdictChange = (value) => {
    setVerdictFilter(value);
  };

  const filteredReports = reportsData.filter((report) => {
    if (verdictFilter && verdictFilter !== "All") {
      // Filter by verdict
      // Assuming verdict data is available in each report object
      return report.result.verdict === verdictFilter;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <PageTitle title="My Reports" />
        <div>
          <Select defaultValue="All" onChange={handleVerdictChange}>
            <Option value="All">All Verdict</Option>
            <Option value="Pass">Pass</Option>
            <Option value="Fail">Fail</Option>
          </Select>
        </div>
      </div>
      <div className="divider"></div>
      <Table columns={columns} dataSource={filteredReports} />
    </div>
  );
}

export default UserReports;
