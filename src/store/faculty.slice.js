import { create } from "zustand";
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyAvailability,
} from "../services/faculty.service";

const initialState = {
  facultyList: [],
  isLoading: false,
  error: null,
  selectedFaculty: null,
  facultyAvailability: null,
};

export const useFacultyStore = create((set) => ({
  ...initialState,

  getFaculty: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await getAllFaculty();

      if (res.success) {
        set({
          facultyList: res.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to fetch faculty",
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

  addFaculty: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const res = await createFaculty(payload);

      if (res.success) {
        // Add the new faculty to the list
        set((state) => ({
          facultyList: [],
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

  updateFaculty: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const res = await updateFaculty(payload);

      if (res.success) {
        // Update the faculty in the list
        set((state) => ({
          facultyList: [],
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

  deleteFaculty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await deleteFaculty(id);
      if (res.success) {
        set((state) => ({
          facultyList: [],
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

  getFacultyAvailability: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await getFacultyAvailability(id);

      if (res.success) {
        set({
          facultyAvailability: res?.data?.matrix,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: res.message || "Failed to fetch faculty",
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

  setSelectedFaculty: (faculty) => {
    set({ selectedFaculty: faculty, facultyAvailability: null });
  },

  reset: () => {
    set(initialState);
  },
}));
