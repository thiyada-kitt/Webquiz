import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Modal, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function UserReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "ชื่อแบบทดสอบ",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
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
      title: "ผลลัพธ์",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "เวลาที่ใช้",
      dataIndex: "timeUsed",
      render: (text, record) => <>{("0" + Math.floor(record.result.timeUsed/60)).slice(-2)}:{("0" + record.result.timeUsed%60).slice(-2)}</>,
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

  return (
    <div>
      <PageTitle title="ประวัติการเล่น" />
      <div className="divider"></div>
      <Table columns={columns} dataSource={reportsData} />
    </div>
  );
}

export default UserReports;
