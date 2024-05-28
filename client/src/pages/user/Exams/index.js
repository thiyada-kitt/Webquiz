import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, fetchExambyUserID } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getUserInfo } from "../../../apicalls/users";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [userID, setUserID] = useState(null);
  const dispatch = useDispatch();

  const getUserID = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        setUserID(response.data._id);
        getExamsData(response.data._id);  // Fetch exams data after getting user ID
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamsData = async (user) => {
    try {
      dispatch(ShowLoading());
      const response = await fetchExambyUserID(user);
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData(userID);  // Refresh exams data after deletion
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
    },
    {
      title: "Mode",
      dataIndex: "mode",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => (text === null ? "-" : text),
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => navigate(`/user/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUserID();
  }, []);

  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />
        <button
          className="primary-outlined-btn flex items-center"
          onClick={() => navigate("/user/exams/add")}
        >
          <i className="ri-add-line"></i>
          Add Exam
        </button>
      </div>
      <div className="divider"></div>
      <Table columns={columns} dataSource={exams} />
    </div>
  );
}

export default Exams;
