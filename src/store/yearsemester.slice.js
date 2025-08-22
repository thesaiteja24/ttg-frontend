import { create } from "zustand";
import {
  createYearSemester,
  deleteYearSemester,
  getYearSemesters,
  updateYearSemester,
} from "../services/yearsemester.service";

const initialState = {
  yearSemestersList: [],
  yearSemesters: [],
  selectedYearSemester: null,
  isLoading: false,
  error: null,
};

export const useYearSemesterStore = create((set) => ({
  ...initialState,

  getYearSemesters: async (isDropdown) => {
    set({ isLoading: true });

    try {
      const res = await getYearSemesters(isDropdown);

      if (res.success) {
        set({
          [isDropdown ? "yearSemesters" : "yearSemestersList"]: res.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to fetch year-semesters.",
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

  addYearSemester: async (payload) => {
    set({ isLoading: true });

    try {
      const res = await createYearSemester(payload);

      if (res.success) {
        set((state) => ({
          yearSemestersList: [],
          yearSemesters: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to create year-semester.",
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

  updateYearSemester: async (payload) => {
    set({ isLoading: true });

    try {
      const res = await updateYearSemester(payload);

      if (res.success) {
        set((state) => ({
          yearSemestersList: [],
          yearSemesters: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to update year-semester.",
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

  deleteYearSemester: async (id) => {
    set({ isLoading: true });

    try {
      const res = await deleteYearSemester(id);

      if (res.success) {
        set((state) => ({
          yearSemestersList: [],
          yearSemesters: [],
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to delete year-semester.",
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

  setSelectedYearSemester: (yearSemester) => {
    set({ selectedYearSemester: yearSemester });
  },

  reset: () => {
    set(initialState);
  },
}));
