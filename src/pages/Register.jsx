// src/pages/Register.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import { useAuthStore } from "../store/auth.slice";
import toast from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  countryCode: z.string().nonempty("Country code is required"),
  phone: z.string().min(6, "Phone number is too short"),
  role: z.string().nonempty("Role is required"),
});

export default function Register() {
  const [countryCode, setCountryCode] = useState("");
  const registerFn = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const payload = { ...data, countryCode };

    await toast.promise(registerFn(payload), {
      loading: "Registering account...",
      success: (res) => {
        if (res?.success) {
          navigate("/login");
          return res.message || "Registration successful!";
        }
        throw new Error(res?.message || "Registration failed");
      },
      error: (err) => err.message || "Something went wrong",
    });
  };

  return (
    <main
      className="flex items-center justify-center bg-black p-4"
      role="main"
    >
      <div
        className="bg-neutral-900 p-8 rounded-lg w-full max-w-md"
        aria-labelledby="register-title"
      >
        <h2
          id="register-title"
          className="text-white text-2xl font-semibold mb-1"
        >
          Create an account
        </h2>
        <p className="text-gray-300 mb-6">Enter your details to register</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-white mb-1">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
            />
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-white mb-1">
              Phone
            </label>
            <PhoneInput
              country={"us"}
              value={countryCode}
              inputProps={{
                name: "phone",
                id: "phone",
                required: true,
                "aria-invalid": !!errors.phone,
                "aria-describedby": errors.phone ? "phone-error" : undefined,
              }}
              onChange={(value, country) => {
                setCountryCode(country.dialCode);
                setValue("countryCode", country.dialCode);
                setValue("phone", value.replace(country.dialCode, ""));
              }}
              inputStyle={{
                width: "100%",
                backgroundColor: "#1f1f1f",
                color: "white",
                border: "1px solid #3f3f3f",
              }}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm text-white mb-1">
              Role
            </label>
            <select
              id="role"
              {...register("role")}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? "role-error" : undefined}
              className="w-full px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
            {errors.role && (
              <p id="role-error" className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full bg-white text-black py-2 rounded font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
