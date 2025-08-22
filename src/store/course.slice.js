import { create } from "zustand";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "../services/course.service";

const initialState = {
  courseList: [],
  isLoading: false,
  error: null,
  selectedCourse: null,
};

export const useCourseStore = create((set) => ({
  ...initialState,

  getCourses: async () => {
    set({ isLoading: true });
    try {
      const res = await getAllCourses();

      if (res.success) {
        set({
          courseList: res.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to fetch courses",
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

  createCourse: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const res = await createCourse(payload);

      if (res.success) {
        // Add the new course to the list
        set((state) => ({
          courseList: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to create faculty",
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

  updateCourse: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const res = await updateCourse(payload);

      if (res.success) {
        // Update the course in the list
        set((state) => ({
          courseList: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to update faculty",
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

  deleteCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await deleteCourse(id);
      if (res.success) {
        set((state) => ({
          courseList: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to delete faculty",
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

  setSelectedCourse: (course) => {
    set({ selectedCourse: course });
  },

  reset: () => {
    set(initialState);
  },
}));
