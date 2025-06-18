'use client';

import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SignupPage() {
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
          <Logo iconSize={40} textSize="text-3xl" href="/" />
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <div className="mb-8">
         <Logo iconSize={40} textSize="text-3xl" href="/" />
      </div>
      <SignupForm />
    </div>
  );
}
