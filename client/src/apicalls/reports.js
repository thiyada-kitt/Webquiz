import axios from "axios";
const { default: axiosInstance } = require(".");

// add report
export const addReport = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/reports/add-report", payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// get all reports
export const getAllReports = async (filters) => {
    try {
      const response = await axiosInstance.post("/api/reports/get-all-reports" , filters); 
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

// get leaderboards reports
export const getLeaderboards = async (filters) => {
    try {
        const response = await axiosInstance.post("/api/reports/get-leaderboards" , filters);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// get all reports by user
export const getAllReportsByUser = async () => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports-by-user");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getReportsByExam = async (examId) => {
    try {
      const response = await axios.get(`/api/reports/get-reports-by-exam/${examId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };