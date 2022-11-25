import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export const API_URL = "https://user-management-systems-4.herokuapp.com/";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${cookies.get("accessToken")}`,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
