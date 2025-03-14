import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { updateUserProfile, getUserProfile } from "../../../apicalls/users"; // Import the getUserProfile API

function ProfileUpdate() {
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Ant Design form instance
  const [userData, setUserData] = useState(null); // Store the user data

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getUserProfile(); // Fetch the user profile data
        dispatch(HideLoading());
        if (response.success) {
          setUserData(response.data); // Set the fetched user data to state
          form.setFieldsValue({
            name: response.data.name,
            email: response.data.email,
          }); // Prefill the form fields
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error("Failed to fetch user profile.");
        dispatch(HideLoading());
      }
    };
    fetchProfile();
  }, [dispatch, form]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await updateUserProfile(values); // Update user profile function
      dispatch(HideLoading());
      if (response.success) {
        message.success("Profile updated successfully!"); // display success message
      } else {
        message.error(response.message); // display error message
      }
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  return (
    <div className="flex justify-center items-center h-100 w-100 bg-white">
      <div className="card w-400 p-3 bg-white mt-2">
        <div className="flex flex-col">
          <div className="flex">
            <h2 className="txt-2xl">
              UPDATE PROFILE <i className="ri-user-settings-line"></i>
            </h2>
          </div>
          <div className="divider"></div>
          <Form
            form={form} // Attach the form instance
            layout="vertical"
            className="mt-2"
            onFinish={onFinish}
            initialValues={userData} // Set initial values
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <input type="text" placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <input type="text" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input type="password" placeholder="Enter a new password" />
            </Form.Item>
            <div className="flex flex-col gap-2">
              <button type="submit" className="primary-contained-btn mt-2 w-100">
                Update Profile
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;
