
'use client';

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
        <div className="mb-8">
          <Logo iconSize={40} textSize="text-3xl" />
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }
  
  // If authenticated and not loading, the useEffect above will handle the redirect.
  // We render the form if not authenticated.
  if (isAuthenticated) return null;


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <div className="mb-8">
        <Logo iconSize={40} textSize="text-3xl" />
      </div>
      <LoginForm />
    </div>
  );
}
