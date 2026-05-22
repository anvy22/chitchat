"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/AuthContext";
import { Orbit } from "lucide-react";
import { motion } from "framer-motion";

function CallbackContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // With implicit flow, Supabase returns tokens in the URL hash fragment
      // e.g. #access_token=...&token_type=bearer&...
      const hashParams = new URLSearchParams(
        window.location.hash.substring(1) // remove the leading '#'
      );
      const accessToken = hashParams.get("access_token");

      if (!accessToken) {
        setError("No authentication token found.");
        return;
      }

      try {
        // Send the Supabase access token to our backend
        // Our backend validates it with the service role, creates a workspace if needed,
        // and returns our custom JWTs
        const response = await apiClient.post("/auth/oauth-callback", {
          token: accessToken,
        });

        if (response.data.success) {
          const { accessToken: appToken, user } = response.data.data;
          login(appToken, user);
          router.push("/dashboard");
        } else {
          setError(response.data.message || "Authentication failed.");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.response?.data?.message || "An error occurred during authentication.");
      }
    };

    handleCallback();
  }, [router, login]);

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <Orbit className="w-8 h-8 text-white" />
        </motion.div>

        {error ? (
          <div className="text-red-400 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
            <p className="text-on-surface-muted">{error}</p>
            <button
              onClick={() => router.push('/sign-in')}
              className="mt-4 px-4 py-2 bg-surface-high rounded-md text-on-surface hover:bg-surface-highest transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-medium text-on-surface animate-pulse">
            Authenticating your workspace...
          </h2>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <Orbit className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
