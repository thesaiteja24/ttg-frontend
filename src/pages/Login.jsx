// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/auth.slice";
import toast from "react-hot-toast";
import { useNavigate, Link, replace } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await toast.promise(
      login(data),
      {
        loading: "Logging in...",
        success: (res) => {
          if (res?.success) {
            navigate("/dashboard", { replace: true });
            return res.message || "Login successful!";
          }
          throw new Error(res?.message || "Login failed");
        },
        error: (err) => err.message || "Something went wrong",
      }
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-semibold mb-1">
          Login to your account
        </h2>
        <p className="text-gray-400 mb-6">
          Enter your email below to login to your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div>
            <label htmlFor="email" className="block text-sm text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-gray-500"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-gray-500"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded font-medium hover:bg-gray-200 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
