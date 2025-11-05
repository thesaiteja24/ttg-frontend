import api from "./api";
import { FACULTY_URL as facultyURl } from "../constants";
import { handleApiResponse } from "../utils/handleApiResponse";

export const getAllFaculty = async () => {
  try {
    const response = await api.get(facultyURl);
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

export const createFaculty = async (payload) => {
  try {
    const response = await api.post(facultyURl, payload);
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

export const updateFaculty = async (payload) => {
  try {
    const response = await api.put(facultyURl, payload);
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

export const deleteFaculty = async (id) => {
  try {
    const response = await api.delete(`${facultyURl}/${id}`);
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

export const getFacultyAvailability = async (id) => {
  try {
    const response = await api.get(`${facultyURl}/${id}/schedule`);
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
