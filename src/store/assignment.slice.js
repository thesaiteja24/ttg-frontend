import { create } from "zustand";
import {
  createAssignment,
  getAssignments,
} from "../services/assignment.service";

const initialState = {
  assignmentList: [],
  isLoading: false,
  error: null,
};

export const useAssignmentStore = create((set) => ({
  ...initialState,

  getAssignments: async (yearSemesterId) => {
    set({ isLoading: true, assignmentList: [] });
    try {
      const res = await getAssignments(yearSemesterId);
      if (res.success) {
        set({
          assignmentList: Array.isArray(res.data) ? res.data : [],
          isLoading: false,
          error: null,
        });
      } else {
        set({
          assignmentList: [],
          isLoading: false,
          error: res.message || "Failed to fetch assignments.",
        });
      }
      return res;
    } catch (err) {
      let message;
      if (err.message && err.errors?.length) {
        message = err.message + ": " + err.errors.map((e) => e).join(", ");
      } else if (err.message) {
        message = err.message;
      } else {
        message = "Something went wrong";
      }
      const normalizedError = {
        success: false,
        message,
      };
      set({
        assignmentList: [],
        error: normalizedError.message,
        isLoading: false,
      });
      return normalizedError;
    }
  },

  addAssignment: async (payload) => {
    set({ isLoading: true });

    try {
      const res = await createAssignment(payload);

      if (res.success) {
        set(() => ({
          assignmentList: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to create assignment.",
        });
      }

      return res;
    } catch (err) {
      let message;
      if (err.message && err.errors?.length) {
        message = err.message + ": " + err.errors.map((e) => e).join(", ");
      } else if (err.message) {
        message = err.message;
      } else {
        message = "Something went wrong";
      }
      const normalizedError = {
        success: false,
        message,
      };

      set({
        error: normalizedError.message,
        isLoading: false,
      });

      return normalizedError;
    }
  },
}));
