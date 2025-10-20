import axios from "axios";
import { API_BASE_URL } from "../config";

export const addSearchHistory = async (data, token) => {
  const res = await axios.post(`${API_BASE_URL}/search-history`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSearchHistory = async (token) => {
  const res = await axios.get(`${API_BASE_URL}/search-history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
