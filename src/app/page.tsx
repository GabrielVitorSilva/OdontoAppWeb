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
import AppoitmentImage from '../assets/appointment.png'
import SmartAppoitment from '../assets/smart-schedule.png'

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

  if (isAuthenticated) return null;


  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-blue-100">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="text-sm px-2 sm:px-4" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" className="text-sm px-2 sm:px-4" asChild>
              <Link href="/auth/signup">
                <span className="hidden sm:inline">Cadastre-se</span>
                <span className="sm:hidden">Cadastrar</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid items-center gap-4 sm:gap-6 pb-6 sm:pb-8 pt-4 sm:pt-6 md:py-10 px-4">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-3 sm:gap-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tighter">
              Bem-vindo ao <span className="text-primary">OdontoApp</span>
            </h1>
            <p className="max-w-[700px] text-base sm:text-lg text-foreground/80 px-4 sm:px-0">
              Gerencie sua clínica odontológica com facilidade. Agendamentos, tratamentos e histórico de pacientes em um só lugar.
            </p>
          </div>
          <div className="mx-auto mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg lg:max-w-xl px-4 sm:px-0 justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-sm sm:text-base">Acessar minha conta</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/auth/signup">
                <span className="text-sm sm:text-base">Criar nova conta</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container py-8 sm:py-12 px-4">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                 <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-4">
                        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-lg">
                            <Image 
                                src={AppoitmentImage} 
                                alt="Gerenciamento de Tratamentos" 
                                fill
                                className="object-cover" 
                                data-ai-hint="dental treatment plan" 
                            />
                        </div>
                        <CardTitle className="mt-4 text-lg sm:text-xl">Gerenciamento de Tratamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm sm:text-base">
                            Crie e organize planos de tratamento personalizados para cada paciente de forma eficiente.
                        </CardDescription>
                    </CardContent>
                </Card>
                 <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-4">
                        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-lg">
                            <Image 
                                src={SmartAppoitment} 
                                alt="Agendamento de Consultas" 
                                fill
                                className="object-cover" 
                                data-ai-hint="calendar schedule appointment" 
                            />
                        </div>
                        <CardTitle className="mt-4 text-lg sm:text-xl">Agendamento Inteligente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm sm:text-base">
                            Facilite o agendamento de consultas para seus pacientes e otimize a agenda dos profissionais.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>

      <footer className="border-t py-4 sm:py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-2 sm:gap-4 md:h-16 md:flex-row px-4">
          <p className="text-balance text-center text-xs sm:text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} OdontoApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
