import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser, registerUser } from "../services/auth.service";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      login: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await loginUser(payload);

          if (res.success) {
            set({
              user: res.data.user,
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: res.message || "Login failed",
            });
          }

          return res; // ✅ single return
        } catch (err) {
          const normalizedError = {
            success: false,
            message: err.message || "Something went wrong",
          };

          set({
            error: normalizedError.message,
            isLoading: false,
          });

          return normalizedError; // ✅ still a single exit path
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await registerUser(payload);

          set({ isLoading: false });
          return res; // ✅ single return
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

      logout: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
