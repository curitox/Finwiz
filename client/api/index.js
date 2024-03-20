import axios from "axios";
//http://10.0.2.2:
const API = axios.create({
  baseURL: "http://10.0.2.2:5000/",
});

export const UserSignUp = async (data) => await API.post("/auth/signup", data);

export const UserSignIn = async (data) => await API.post("/auth/signin", data);

export const generateOtp = async (data) =>
  await API.post("/auth/generate-otp", data);

export const verifyOtp = async (data) =>
  await API.post("/auth/verifyOTP", data);
