import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
  });
  const columns = [
    {
      title: "ชื่อแบบทดสอบ",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "วันที่ทำแบบทดสอบ",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "คะแนนทั้งหมด",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "คะแนนผ่าน",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "คะแนนที่ได้",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "ผลที่ได้รับ",
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

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <PageTitle title="ประวัติการเล่น" />
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
        <button
          className="primary-outlined-btn"
          onClick={() => {
            setFilters({
              examName: "",
              userName: "",
            });
            getData({
              examName: "",
              userName: "",
            });
          }}
        >
          Clear
        </button>
        <button className="primary-contained-btn" onClick={() => getData(filters)}>
          Search
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-2" />
    </div>
  );
}

export default AdminReports;
