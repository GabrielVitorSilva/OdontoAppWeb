'use client';

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, loading, user } = useAuth();
  console.log('user:', user);
  const router = useRouter();

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    };

    redirectIfAuthenticated();
  }, [isAuthenticated, router]);

  // Mostra tela de carregamento enquanto verifica autenticação
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

  // Se não estiver carregando e não estiver autenticado, mostra o formulário de login
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

  // Se estiver autenticado, mostra tela de carregamento enquanto redireciona
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <div className="mb-8">
        <Logo iconSize={40} textSize="text-3xl" />
      </div>
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}