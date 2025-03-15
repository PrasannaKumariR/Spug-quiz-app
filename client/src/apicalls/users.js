import axios from "axios";
const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.post("/api/users/get-user-info");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.post("/api/users/get-profile"); // Adjust API endpoint as necessary
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.post("/api/users/update-profile", userData); // Adjust the API endpoint
    return response.data;
  } catch (error) {
    throw error;
  }
};

