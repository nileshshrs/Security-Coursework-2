import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { resetPassword } from "@/api/api";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,24}$/;

const schema = z.object({
  password: z
    .string()
    .regex(
      PWD_REGEX,
      "Password must be 8-24 chars, with uppercase, lowercase, and a number"
    ),
});

type FormData = z.infer<typeof schema>;

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verificationCode = searchParams.get("code");
  const expiresAt = searchParams.get("exp");

  const [passwordValue, setPasswordValue] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: ({ password }: { password: string }) =>
      resetPassword({ password, verificationCode: verificationCode || "" }),
    onSuccess: () => {
      setSuccessMessage("Password reset successful. Redirecting to login...");
      setErrorMessage(null);
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to reset password.";
      setErrorMessage(msg);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ password: data.password });
  };

  // Redirect if invalid or expired link
  useEffect(() => {
    if (!verificationCode || !expiresAt) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    const exp = parseInt(expiresAt);
    if (isNaN(exp) || Date.now() > exp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [verificationCode, expiresAt, navigate]);

  const meter = getPasswordStrength(passwordValue);
  const meterColors = ["bg-red-500", "bg-yellow-500", "bg-green-600"];
  const meterWidths = ["w-1/3", "w-2/3", "w-full"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-md rounded-lg shadow-lg bg-white border-0 flex flex-col items-center">
        <div className="w-full px-5 py-8 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-gray-900 text-center">
            Reset your password
          </h2>
          <p className="mb-5 text-gray-500 text-base text-center">
            Enter a new password for your account.
          </p>
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <Label
                htmlFor="password"
                className="font-semibold text-gray-700 mb-2 block text-base"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="off"
                placeholder="Enter new password"
                {...register("password")}
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                onChange={e => {
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-xs mt-1">{successMessage}</p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full rounded-sm font-semibold py-2 text-base bg-black text-white hover:bg-gray-800 transition"
            >
              {mutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a
              href="/sign-in"
              className="text-gray-500 text-base underline hover:text-black transition-colors"
            >
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
