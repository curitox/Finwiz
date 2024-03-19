import axios from "axios";
//http://10.0.2.2:
const API = axios.create({
  baseURL: "http://10.0.2.2:5000/",
});

export const UserSignUp = async (data) => await API.post("/signup", data);

export const UserSignIn = async (data) => await API.post("/signin", data);
