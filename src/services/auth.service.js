// src/services/auth.service.js
import api from "./api";
import {
  REGISTER_URL as registerUrl,
  LOGIN_URL as loginUrl,
} from "../constants";
import { handleApiResponse } from "../utils/handleApiResponse";

export const registerUser = async (payload) => {
  try {
    const response = await api.post(registerUrl, payload);

    return handleApiResponse(response);
  } catch (error) {
    // normalize error object (keep same shape as handleApiResponse)
    const errData = error.response?.data;
    if (errData) return Promise.reject(errData);
    return Promise.reject({
      success: false,
      message: error.message || "Network error",
    });
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await api.post(loginUrl, payload);
    return handleApiResponse(response);
  } catch (error) {
    const errData = error.response?.data;
    if (errData) return Promise.reject(errData);
    return Promise.reject({
      success: false,
      message: error.message || "Network error",
    });
  }
};
