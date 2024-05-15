import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
// eslint-disable-next-line
import { loginAdmin } from "../../../apicalls/admin";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Login() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-blue-background">
      <div className="card w-400 p-3 bg-white">
        <div className="flex flex-col">
            <h1 className="text-5xl text-center font-bold">
              Quizuzz!
            </h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="email" label="อีเมล">
              <input type="text" />
            </Form.Item>
            <Form.Item name="password" label="รหัสผ่าน">
              <input type="password" />
            </Form.Item>

            <div className="flex flex-col gap-2 ">
              <button
                type="submit"
                className="primarya-contained-btn mt-2 w-100"
              >
                เข้าสู่ระบบ
              </button>
              <Link to="/register" className="underline">
                ไม่เคยมีบัญชี? สร้างบัญชี
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
