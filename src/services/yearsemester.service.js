import api from "./api";
import { YEAR_SEMESTER_URL as year_semester_url } from "../constants";
import { handleApiResponse } from "../utils/handleApiResponse";

export const getYearSemesters = async (isDropdown) => {
  try {
    const response = await api.get(year_semester_url, {
      params: { isDropdown },
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

export const getClasses = async () => {
  try {
    const response = await api.get(`${year_semester_url}/classes`);
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

export const createYearSemester = async (payload) => {
  try {
    const response = await api.post(year_semester_url, payload);
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

export const updateYearSemester = async (payload) => {
  try {
    const response = await api.put(year_semester_url, payload);
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

export const deleteYearSemester = async (id) => {
  try {
    const response = await api.delete(`${year_semester_url}/${id}`);
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
