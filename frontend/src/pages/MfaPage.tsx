import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define a schema that only allows exactly 6 digits
const schema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must be a 6-digit number"),
});

type MfaForm = z.infer<typeof schema>;

export default function MfaPage() {
  const { mfa, verifyMfa } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<MfaForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Redirect if not in MFA
  useEffect(() => {
    if (!mfa?.requiresMFA) {
      navigate("/sign-in", { replace: true });
    }
  }, [mfa, navigate]);

  async function onSubmit(data: MfaForm) {
    try {
      await verifyMfa({ code: data.code });
      reset();
      navigate("/", { replace: true });
    } catch (err: any) {
      setError("code", { message: err?.message || "Invalid code. Please try again." });
    }
  }

  if (!mfa?.requiresMFA) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-md rounded-lg shadow-lg bg-white border-0 flex flex-col items-center">
        <div className="w-full px-5 py-8 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-gray-900 text-center">
            Enter MFA Code
          </h2>
          <p className="mb-4 text-gray-500 text-base text-center">
            We sent a 6-digit code to your email.<br />
            Please enter it below to continue.
          </p>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                minLength={6}
                autoFocus
                placeholder="Enter 6-digit code"
                {...register("code")}
                onInput={e => {
                  // Remove non-digits immediately
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/[^0-9]/g, "");
                }}
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base tracking-widest text-center"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-2 text-center">{errors.code.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-sm font-semibold py-2 text-base bg-black text-white hover:bg-gray-800 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
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
