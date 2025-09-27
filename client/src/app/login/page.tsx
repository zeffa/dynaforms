"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoginMutation } from "@/hooks/useForms";
import LoginError from "@/components/login/LoginError";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { 
    mutate: login, 
    isPending: isLoading, 
    error: loginError 
  } = useLoginMutation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const nextUrl = searchParams.get("next") || "/";
      router.push(nextUrl);
    }
  }, [router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    login(
      { username, password },
      {
        onSuccess: () => {
          const nextUrl = searchParams.get("next") || "/";
          router.push(nextUrl);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {loginError && (
          <LoginError loginError={loginError} />
        )}

        <LoginForm
          username={username}
          password={password}
          isLoading={isLoading}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
