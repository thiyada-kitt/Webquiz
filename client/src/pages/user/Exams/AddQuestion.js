import { Form, message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getUserInfo } from "../../../apicalls/users";
import { addPresetQuestion } from "../../../apicalls/exams";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
    selectedQuestion,
    setSelectedQuestion
}) {
  const dispatch = useDispatch();

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
  const [user, setUser] = React.useState("") // Mark creator for an exam

    React.useEffect(() => {
        getUserData();
    }, []);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        tempUser: user,
      };

      console.log(requiredPayload)
      let response;
        if(selectedQuestion){
            response = await editQuestionById({
                ...requiredPayload,
                questionId: selectedQuestion._id
            })
        }
        else{
            response = await addPresetQuestion(requiredPayload); // Should be fixed here
        }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null)
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      visible={showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        setShowAddEditQuestionModal(false)
        setSelectedQuestion(null)
      }}
    >
      <Form onFinish={onFinish} layout="vertical"
        initialValues={{
            name: selectedQuestion?.name,
            A: selectedQuestion?.options?.A,
            B: selectedQuestion?.options?.B,
            C: selectedQuestion?.options?.C,
            D: selectedQuestion?.options?.D,
            correctOption: selectedQuestion?.correctOption,
        }}
      >
        <Form.Item name="name" label="Question">
          <input type="text" />
        </Form.Item>
        <Form.Item name="correctOption" label="Correct Option">
          <input type="text" />
        </Form.Item>

        <div className="flex gap-3">
          <Form.Item name="A" label="Option A">
            <input type="text" />
          </Form.Item>
          <Form.Item name="B" label="Option B">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="flex gap-3">
          <Form.Item name="C" label="Option C">
            <input type="text" />
          </Form.Item>
          <Form.Item name="D" label="Option D">
            <input type="text" />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-2 gap-3">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => setShowAddEditQuestionModal(false)}
          >
            Cancel
          </button>
          <button className="primary-contained-btn" >Save</button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditQuestion;