import axios from "axios";
//http://10.0.2.2:8000
const API = axios.create({
  // baseURL: "https://expense-tracker-9kx3.onrender.com/",
  baseURL: "http://10.0.2.2:8000/",
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

//Expences
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
export const GetYearlyExpences = async (year, token) =>
  await API.get(`/expense/yearly?year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const AddGoal = async (data, token) =>
  await API.post("/goal/add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const GetGoals = async (token) =>
  await API.get("/goal/get", {
    headers: { Authorization: `Bearer ${token}` },
  });

//Predictions
export const PredictInvestment = async (data, token) =>
  await API.post("/predict/invest", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const BudgetAnalysis = async (token) =>
  await API.get("/predict/budget_recommendations", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Savings
export const GetGoalSavings = async (id, token) =>
  await API.get(`/goal/savings?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const AddSavingsToGoal = async (id, data, token) =>
  await API.post(`/goal/progress?id=${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Analytics
export const GetExpenceCategory = async (token) =>
  await API.get("/get/expenseCategory", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const GetWeeklyExpence = async (token) =>
  await API.get("/get/expenseWeekly", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const GetGoalStatus = async (token) =>
  await API.get("/get/goalStatus", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const GetGoalsGraph = async (token) =>
  await API.get("/get/goalsGraph", {
    headers: { Authorization: `Bearer ${token}` },
  });
