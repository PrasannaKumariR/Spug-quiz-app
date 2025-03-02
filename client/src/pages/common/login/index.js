import React from "react";
import { Form } from "antd";
import { message } from "antd"; // if you're using Ant Design
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Login() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      console.log("Response from server:", response); // Check response data
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message); // display success message
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message); //display error message
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-primary">
      <div className="card w-400 p-3 bg-white">
        <div className="flex flex-col">
          <div className="flex text-align">
            <h2 className="txt-2xl ">
              LOGIN <i class="ri-login-circle-line"></i>
            </h2>
          </div>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
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
                Login
              </button>
              <Link to="/register" className="underline mt-2 ">
                Not a member? Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
