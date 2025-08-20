import { create } from "zustand";
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../services/faculty.service";

const initialState = {
  facultyList: [],
  isLoading: false,
  error: null,
  selectedFaculty: null,
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
      const normalizedError = {
        success: false,
        message: err.message || "Something went wrong",
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
          facultyList: [...state.facultyList, res.data],
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
      const normalizedError = {
        success: false,
        message:
          err.message + ": " + err.errors?.map((e) => e).join(", ") ||
          "Something went wrong",
      };

      set({
        error: normalizedError.message,
        isLoading: false,
      });

      return normalizedError;
    }
  },

  updateFaculty: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const res = await updateFaculty(id);

      if (res.success) {
        // Update the faculty in the list
        set((state) => ({
          facultyList: state.facultyList.map((faculty) =>
            faculty._id === res.data._id ? res.data : faculty
          ),
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
      const normalizedError = {
        success: false,
        message:
          err.message +
          ": " +
          (err.errors?.map((e) => e).join(", ") || "Something went wrong"),
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
          facultyList: state.facultyList.filter(
            (faculty) => faculty._id !== id
          ),
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
      const normalizedError = {
        success: false,
        message:
          err.message +
          ": " +
          (err.errors?.map((e) => e).join(", ") || "Something went wrong"),
      };

      set({
        error: normalizedError.message,
        isLoading: false,
      });

      return normalizedError;
    }
  },

  setSelectedFaculty: (faculty) => {
    set({ selectedFaculty: faculty });
  },

  reset: () => {
    set(initialState);
  },
}));
