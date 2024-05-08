import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
            Kaheet!
          </h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="ชื่อผู้ใช้">
              <input type="text" />
            </Form.Item>
            <Form.Item name="email" label="อีเมล">
              <input type="email" />
            </Form.Item>
            <Form.Item name="password" label="รหัสผ่าน">
              <input type="password" />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="primarya-contained-btn mt-2 w-100"
              >
                สมัครสมาชิก
              </button>
              <Link to="/login">มีบัญชีอยู่แล้ว? ต้องการเข้าสู่ระบบ</Link>
              <Link to="/adminreg">เข้าสู่ระบบแอดมิน</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
