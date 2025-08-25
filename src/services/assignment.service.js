import { ASSIGNMENT_URL as assignment_url } from "../constants";
import { handleApiResponse } from "../utils/handleApiResponse";
import api from "./api";

export const getAssignments = async (yearSemesterId = null) => {
  try {
    const response = await api.get(assignment_url, {
      params: { yearSemesterId },
    });
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

export const createAssignment = async (payload) => {
  try {
    const response = await api.post(assignment_url, payload);
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
