import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sendPasswordResetEmail } from "@/api/api";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (email: string) => sendPasswordResetEmail(email),
    onSuccess: () => {
      setSuccessMessage("Password reset email sent successfully.");
      setErrorMessage(null);
      reset();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Something went wrong.";
      setErrorMessage(msg);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-md rounded-lg shadow-lg bg-white border-0 flex flex-col items-center">
        <div className="w-full px-5 py-8 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-gray-900 text-center">
            Forgot your password?
          </h2>
          <p className="mb-5 text-gray-500 text-base text-center">
            Enter your email and we’ll send you a reset link.
          </p>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="reset_email" className="font-semibold text-gray-700 mb-2 block text-base">
                Email address
              </Label>
              <Input
                id="reset_email"
                type="email"
                autoComplete="off"
                placeholder="Enter your email"
                {...register("email")}
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
              {mutation.isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/sign-in"
              className="text-gray-500 text-base underline hover:text-black transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
