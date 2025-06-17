'use client';

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    };

    redirectIfAuthenticated();
  }, [isAuthenticated, router]);

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

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
        <div className="mb-8">
          <Logo iconSize={40} textSize="text-3xl" />
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <div className="mb-8">
        <Logo iconSize={40} textSize="text-3xl" />
      </div>
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}