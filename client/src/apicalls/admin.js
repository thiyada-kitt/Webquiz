const { default: axiosInstance } = require(".");
export const loginAdmin = async (payload) => {
  try {
       const response = await axiosInstance.post('/api/admins/login', payload);
       return response.data;
  } catch (error) {
       return error.response.data;
  }
};

export const registerAdmin = async (payload) => {
  try {
     const response = await axiosInstance.post("/api/admins/register", payload);
     return response.data;
  } catch (error) {
     return error.response.data;
  }
}

export default axiosInstance;
