import { Col, Form, message, Row, Select, Table } from "antd";
import React, { useEffect } from "react";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { Tabs } from "antd";
import AddEditQuestion from "./AddEditQuestion";
import AddQuestion from "./AddQuestion"
import { getUserInfo } from "../../../apicalls/users";
import { addMultiQuestion, getDraftQuestion } from "../../../apicalls/exams";
const { TabPane } = Tabs;


function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = React.useState(null); // ต้องทำกรณีเพิ่มข้อมูล Draft
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const params = useParams();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;
      let response2;

      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id,
          
        });
        if (response.success) {
          message.success(response.message);
          navigate("/admin/exams");
        } else {
          message.error(response.message);
        }
      } else {
        response = await addExam({...values,
          user: user
        });
        response2 = await addMultiQuestion({
          user: user
        })
        if (response.success && response2.success) {
          message.success(response.message);
          navigate("/admin/exams");
        } else {
          message.error(response.message);
        }
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      let response;
      dispatch(ShowLoading()); // Will continue this one
      if (params.id){
        response = await getExamById({
        examId: params.id,
        });
        dispatch(HideLoading());
        if (response.success) {
          setExamData(response.data);
        } else {
          message.error(response.message);
        }}
      else if (user){
        response = await getDraftQuestion({
          user: user,
        })
        dispatch(HideLoading());
        if (response.success) {
          setExamData(response.data);
        } else {
          message.error(response.message);
        }
      }
      
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };


  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId : params.id
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => {
          return (
            <div>
              {key} : {record.options[key]}
            </div>
          );
        });
      },
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text, record) => {
        return ` ${record.correctOption} : ${
          record.options[record.correctOption]
        }`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteQuestion(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];
  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        setUser(response.data._id)
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  const [user, setUser] = React.useState(null) // Mark creator for an exam
  
const onTabClick = (activeKey) => {
  if (activeKey === "2"){
    getExamData();
  }
}

  useEffect(() => {
    
    getUserData();
    getExamData();

  }, []);

  


  return (
    <div>
      <PageTitle title={params.id ? "Edit Exam" : "Add Exam"} />
      <div className="divider"></div>

      {(examData || !params.id) && (
        <Form layout="vertical" onFinish={onFinish} initialValues={examData}>
          <Tabs defaultActiveKey="1" onTabClick={onTabClick}>
            <TabPane tab="Exam Details" key="1">
              <Row gutter={[10, 10]}>
                <Col span={8}>
                  <Form.Item label="Exam Name" name="name">
                    <input type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Exam Duration" name="duration">
                    <input type="number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Mode" name="category">
                    <select name="" id="">
                      <option value="" hidden>Select Mode</option>
                      <option value="Competitive">Competitive</option>
                      <option value="No-Timer">No-Timer</option>
                      {/* <option value="React">React</option>
                      <option value="Node">Node</option>
                      <option value="MongoDB">MongoDB</option>
                      <option value="GK">GK</option>
                      <option value="ML">Machine Learning</option>
                      <option value="ebusiness">E-business</option> */}

                    </select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Total Marks" name="totalMarks">
                    <input type="number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Passing Marks" name="passingMarks">
                    <input type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <div className="flex justify-end gap-2">
                <button
                  className="primary-outlined-btn"
                  type="button"
                  onClick={() => navigate("/admin/exams")}
                >
                  Cancel
                </button>
                <button className="primary-contained-btn" type="submit">
                  Save
                </button>
              </div>
            </TabPane>
            <TabPane tab={params.id ? "Questions" : "Questions (Draft)"} key="2">
                <div className="flex justify-end">
                  <button
                    className="primary-outlined-btn"
                    type="button"
                    onClick={() => setShowAddEditQuestionModal(true)}
                  >
                    Add Question
                  </button>
                </div>

                <Table
                  columns={questionsColumns}
                  dataSource={examData?.questions || examData}
                />
            </TabPane>
          </Tabs>
        </Form>
      )}

      {showAddEditQuestionModal && params.id ? 
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
        : showAddEditQuestionModal &&
        <AddQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      }
    </div>
  );
}

export default AddEditExam;
