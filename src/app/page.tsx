'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Logo iconSize={48} textSize="text-4xl" />
      </div>
    );
  }

  // If authenticated, router.push will handle redirect, this is a fallback or for when JS is disabled (though JS is needed for redirect)
  if (isAuthenticated) return null;


  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-blue-100">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">
                Cadastre-se <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Bem-vindo ao <span className="text-primary">OdontoApp</span>
            </h1>
            <p className="max-w-[700px] text-lg text-foreground/80 sm:text-xl">
              Gerencie sua clínica odontológica com facilidade. Agendamentos, tratamentos e histórico de pacientes em um só lugar.
            </p>
          </div>
          <div className="mx-auto mt-6 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-5 w-5" /> Acessar minha conta
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">
                Criar nova conta <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <Image src="https://placehold.co/600x400.png" alt="Gerenciamento de Tratamentos" width={600} height={400} className="rounded-t-lg" data-ai-hint="dental treatment plan" />
                        <CardTitle className="mt-4">Gerenciamento de Tratamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Crie e organize planos de tratamento personalizados para cada paciente de forma eficiente.</CardDescription>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <Image src="https://placehold.co/600x400.png" alt="Agendamento de Consultas" width={600} height={400} className="rounded-t-lg" data-ai-hint="calendar schedule appointment" />
                        <CardTitle className="mt-4">Agendamento Inteligente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Facilite o agendamento de consultas para seus pacientes e otimize a agenda dos profissionais.</CardDescription>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <Image src="https://placehold.co/600x400.png" alt="Resumo do Cliente com IA" width={600} height={400} className="rounded-t-lg" data-ai-hint="ai medical records" />
                        <CardTitle className="mt-4">Histórico Inteligente com IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Obtenha resumos concisos do histórico de seus pacientes utilizando inteligência artificial.</CardDescription>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} OdontoApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
