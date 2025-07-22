import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const USER_REGEX = /^[a-zA-Z0-9-_]{4,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const registerSchema = z.object({
  name: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(64, "Username must be at most 64 characters")
    .regex(USER_REGEX, "Username can only contain letters, numbers, - or _")
    .refine(
      (val) => !/[<>$={}]/.test(val) && !val.toLowerCase().includes("script"),// < {}
      {
        message: "Username contains potentially dangerous input",
      }
    ),
  email: z
    .string()
    .regex(EMAIL_REGEX, "Invalid email address")
    .refine((val) => !/[<>$={}]/.test(val) && !val.toLowerCase().includes("script"), {
      message: "Email contains potentially dangerous input",
    }),
  password: z
    .string()
    .regex(PWD_REGEX, "Password must be 8-24 chars, with uppercase, lowercase, and a number"),
});


type RegisterValues = z.infer<typeof registerSchema>;

function getPasswordStrength(pwd: string) {
  if (!pwd) return { label: "", score: 0 };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", score: 1 };
  if (score === 3 || score === 4) return { label: "Medium", score: 2 };
  if (score >= 5) return { label: "Strong", score: 3 };
  return { label: "", score: 0 };
}

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [passwordValue, setPasswordValue] = useState("");
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: RegisterValues) => {
    setFormError("");
    try {
      await registerUser({
        email: data.email,
        username: data.name,
        password: data.password,
      });
      navigate("/")
    } catch (err: any) {
      console.error("Registration error:", err);
      setFormError(err?.message || "Something went wrong");
    }
  };

  const meter = getPasswordStrength(passwordValue);
  const meterColors = ["bg-red-500", "bg-yellow-500", "bg-green-600"];
  const meterWidths = ["w-1/3", "w-2/3", "w-full"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <Card className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-md rounded-lg shadow-lg bg-white border-0">
        <CardContent className="px-5 py-8 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-gray-900">
            Sign up
          </h2>
          <p className="mb-3 text-gray-500 text-base">
            Create your account to start shopping
          </p>

          {formError && (
            <div className="mb-4 text-red-600 text-sm font-medium">{formError}</div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="name" className="font-semibold text-gray-700 mb-2 block text-base">
                Username*
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                autoComplete="off"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="font-semibold text-gray-700 mb-2 block text-base">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                autoComplete="off"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email.message}</div>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="font-semibold text-gray-700 mb-2 block text-base">
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create password"
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                autoComplete="off"
                {...register("password")}
                onChange={(e) => {
                  register("password").onChange(e);
                  setPasswordValue(e.target.value);
                }}
                aria-invalid={!!errors.password}
              />
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className={`h-2 rounded transition-all duration-200 ${
                          meter.score === 1
                            ? meterColors[0] + " " + meterWidths[0]
                            : meter.score === 2
                            ? meterColors[1] + " " + meterWidths[1]
                            : meter.score === 3
                            ? meterColors[2] + " " + meterWidths[2]
                            : ""
                        }`}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        meter.score === 1
                          ? "text-red-600"
                          : meter.score === 2
                          ? "text-yellow-600"
                          : meter.score === 3
                          ? "text-green-700"
                          : ""
                      }`}
                    >
                      {meter.label}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <div className="text-red-500 text-xs mt-1">{errors.password.message}</div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm font-semibold py-2 text-base bg-black text-white hover:bg-gray-800 transition"
              disabled={isSubmitting}
            >
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-base">Already have an account?</span>
            <Link
              to="/sign-in"
              className="ml-2 text-black font-medium underline hover:text-gray-800 transition text-base"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
