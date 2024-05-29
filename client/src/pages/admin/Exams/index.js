import { message, Table, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

const { Option } = Select;

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [modeFilter, setModeFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
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
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleModeChange = (value) => {
    setModeFilter(value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const filteredExams = exams.filter((exam) => {
    if (modeFilter && modeFilter !== "All") {
      if (modeFilter === "Timer" && exam.duration) {
        return true;
      } else if (modeFilter === "NoTimer" && !exam.duration) {
        return true;
      }
      return false;
    }
    return true;
  }).filter((exam) => {
    if (categoryFilter && categoryFilter !== "All") {
      return exam.category === categoryFilter;
    }
    return true;
  });

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
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
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
    getExamsData();
  }, []);

  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />

        <div className="flex gap-2">
          <Select defaultValue="All" onChange={handleModeChange}>
            <Option value="All">All Mode</Option>
            <Option value="Timer">Timer</Option>
            <Option value="NoTimer">No Timer</Option>
          </Select>

          <Select defaultValue="All" onChange={handleCategoryChange}>
            <Option value="All">All Category</Option>
            <Option value="Knowledge">Knowledge</Option>
            <Option value="Entertainment">Entertainment</Option>
            <Option value="Game">Game</Option>
          </Select>

          <button
            className="primary-outlined-btn flex items-center"
            onClick={() => navigate("/admin/exams/add")}
          >
            <i className="ri-add-line"></i>
            Add Exam
          </button>
        </div>
      </div>
      <div className="divider"></div>

      <Table columns={columns} dataSource={filteredExams} />
    </div>
  );
}

export default Exams;
