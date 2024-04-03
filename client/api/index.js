import axios from "axios";
//http://10.0.2.2:8000
const API = axios.create({
  baseURL: "https://expense-tracker-9kx3.onrender.com/",
  // baseURL: "http://10.0.2.2:8000/",
});

export const UserSignUp = async (data) => await API.post("/auth/signup", data);

export const UserSignIn = async (data) => await API.post("/auth/signin", data);

export const UserProfileCreate = async (data, token) =>
  await API.post("/user/details", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const generateOtp = async (data) =>
  await API.post("/auth/generate-otp", data);

export const verifyOtp = async (data) =>
  await API.get(`/auth/verifyOTP?code=${data}`);

export const TodaysChart = async (token) =>
  await API.get("/expenseDaily", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AddExpence = async (data, token) =>
  await API.post("/expense/add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const GetExpences = async (token) =>
  await API.get("/expense/get", {
    headers: { Authorization: `Bearer ${token}` },
  });
