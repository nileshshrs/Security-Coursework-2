import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail, getSelf } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const { mutate } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: async (res) => {
      setMessage(res?.message || "Email verified successfully.");

      try {
        const userResponse = await getSelf(); // ✅ fetch the fresh user
        const user = userResponse?.user;

        if (user) {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));

          // ✅ Prevent mismatch logout temporarily
          window.localStorage.setItem("skipMismatchCheck", "true");
          setTimeout(() => {
            window.localStorage.removeItem("skipMismatchCheck");
          }, 2000);
        }

        setStatus("success");
      } catch {
        setStatus("error");
        setMessage("Verification succeeded but failed to fetch user.");
      }
    },
    onError: (error: any) => {
      setStatus("error");
      setMessage(error?.response?.data?.message || "Verification failed or expired.");
    },
  });

  useEffect(() => {
    if (code) {
      setStatus("loading");
      mutate(code);
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md p-6 shadow-lg border rounded-2xl">
        <CardContent className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold mb-1">Verifying your email...</h2>
              <p className="text-sm text-muted-foreground">Hang tight while we process your request.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="mx-auto h-10 w-10 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-green-700 mb-1">Email Verified!</h2>
              <p className="text-sm text-muted-foreground mb-4">{message}</p>
              <Button onClick={() => navigate("/account")}>Go to Account</Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="mx-auto h-10 w-10 text-red-600 mb-4" />
              <h2 className="text-xl font-semibold text-red-700 mb-1">Verification Failed</h2>
              <p className="text-sm text-muted-foreground mb-4">{message}</p>
              <Button variant="outline" onClick={() => navigate("/")}>Return Home</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
