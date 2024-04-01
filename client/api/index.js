import axios from "axios";
//http://10.0.2.2:
const API = axios.create({
  baseURL: "https://expense-tracker-9kx3.onrender.com/",
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
