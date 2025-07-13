import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [fields, setFields] = useState({ usernameOrEmail: "", password: "" });
  const [formError, setFormError] = useState("");
  const { login, mfa } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    try {
      await login({
        usernameOrEmail: fields.usernameOrEmail,
        password: fields.password,
      });
      // Don't redirect here! Let useEffect below handle
    } catch (err: any) {
      setFormError(err?.message || "Login failed");
    }
  }

  // Redirect to MFA page if MFA is required
  useEffect(() => {
    if (mfa && mfa.requiresMFA) {
      navigate("/verify-mfa", { replace: true });
    } else if (mfa === null && localStorage.getItem("user")) {
      // On successful login without MFA, user is set and mfa is null
      navigate("/");
    }
  }, [mfa, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <Card className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-md rounded-lg shadow-lg bg-white border-0">
        <CardContent className="px-5 py-8 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-gray-900">
            Sign in
          </h2>
          <p className="mb-4 text-gray-500 text-base">
            Enter your email or username and password to access your account
          </p>
          {formError && (
            <p className="text-red-500 text-sm mb-4 font-bold">{formError}</p>
          )}
          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <Label
                htmlFor="usernameOrEmail"
                className="font-semibold text-gray-700 mb-2 block text-base"
              >
                Username or Email*
              </Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                autoComplete="off"
                placeholder="username or you@example.com"
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                value={fields.usernameOrEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="font-semibold text-gray-700 mb-2 block text-base"
              >
                Password*
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                value={fields.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-sm font-semibold py-2 text-base bg-black text-white hover:bg-gray-800 transition"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-base">Don't have an account?</span>
            <Link
              to="/sign-up"
              className="ml-2 text-black font-medium underline hover:text-gray-800 transition text-base"
            >
              Sign up
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/account-recovery"
              className="text-gray-600 underline hover:text-black text-sm"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
