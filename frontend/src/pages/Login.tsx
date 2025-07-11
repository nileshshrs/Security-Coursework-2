import React, { useState } from "react";
import DOMPurify from "dompurify";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  const [fields, setFields] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Sanitize input fields before using/sending
    const sanitizedData = {
      email: DOMPurify.sanitize(fields.email),
      password: DOMPurify.sanitize(fields.password),
    };
    // Replace this alert with your login API logic

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <Card className="w-full max-w-[400px] sm:max-w-[360px] md:max-w-md rounded-lg shadow-lg bg-white border-0">
        <CardContent className="px-5 py-8 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-gray-900">
            Sign in
          </h2>
          <p className="mb-7 text-gray-500 text-base">
            Enter your email or username and password to access your account
          </p>
          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <Label
                htmlFor="email"
                className="font-semibold text-gray-700 mb-2 block text-base"
              >
                Username or Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="you@example.com"
                className="bg-[#f6f6f8] border border-gray-200 rounded-sm text-base"
                value={fields.email}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
