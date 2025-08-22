import api from "./api";
import { COURSE_URL as courseUrl } from "../constants";
import { handleApiResponse } from "../utils/handleApiResponse";

export const getAllCourses = async () => {
  try {
    const response = await api.get(courseUrl);
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

export const createCourse = async (payload) => {
  try {
    const response = await api.post(courseUrl, payload);
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

export const updateCourse = async (payload) => {
  try {
    const response = await api.put(courseUrl, payload);
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

export const deleteCourse = async (id) => {
  try {
    const response = await api.delete(`${courseUrl}/${id}`);
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
