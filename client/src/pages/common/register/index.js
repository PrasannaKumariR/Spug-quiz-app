import React from "react";
import { Form } from "antd";
import { message } from "antd"; // if you're using Ant Design
import { Link } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);
      console.log("Response from server:", response); // Check response data
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message); // display success message
      } else {
        message.error(response.message); //display error message
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error occurred:", error);
      dispatch(HideLoading());
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-primary">
      <div className="card w-400 p-3 bg-white">
        <div className="flex flex-col">
          <div className="flex">
            <h2 className="txt-2xl ">
              REGISTER <i class="ri-user-add-line"></i>
            </h2>
          </div>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <input type="text" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input type="text" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input type="password" />
            </Form.Item>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="primary-contained-btn mt-2 w-100"
              >
                Register
              </button>
              <Link to="/login" className="underline mt-2">
                Already a member? Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
