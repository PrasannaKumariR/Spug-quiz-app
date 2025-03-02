const { default: axiosInstance } = require(".");

// Add a report
export const addReport = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/reports/add-report",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get all reports
export const getAllReports = async (filters) => {
  try {
    const response = await axiosInstance.post(
      "/api/reports/get-all-reports",
      filters
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get all reports by user
export const getAllReportsByUser = async () => {
  try {
    const response = await axiosInstance.post(
      "/api/reports/get-all-attempts-by-user"
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
