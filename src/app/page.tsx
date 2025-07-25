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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="text-sm px-2 sm:px-4 hover:bg-blue-100 transition" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button size="sm" className="text-sm px-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white transition" asChild>
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
        <section className="container grid items-center gap-6 sm:gap-8 pb-8 sm:pb-12 pt-6 sm:pt-10 md:py-16 px-4">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 sm:gap-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tighter text-blue-900 drop-shadow-sm">
              Bem-vindo ao <span className="text-blue-600">OdontoApp</span>
            </h1>
            <p className="max-w-[700px] text-base sm:text-lg text-foreground/80 px-4 sm:px-0">
              Gerencie sua clínica odontológica com facilidade. Agendamentos, tratamentos e histórico de pacientes em um só lugar.
            </p>
          </div>
          <div className="mx-auto mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-lg lg:max-w-xl px-4 sm:px-0 justify-center">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md px-6 py-3 text-base sm:text-lg transition-transform hover:scale-105" asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> 
                <span>Acessar minha conta</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg px-6 py-3 text-base sm:text-lg transition-transform hover:scale-105" asChild>
              <Link href="/auth/signup">
                <span>Criar nova conta</span>
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container py-10 sm:py-16 px-4">
            <div className="grid gap-8 sm:gap-10 md:grid-cols-2 max-w-5xl mx-auto">
                 <Card className="rounded-2xl shadow-xl hover:shadow-2xl border-0 bg-white/90 transition-shadow duration-300 group">
                    <CardHeader className="pb-4">
                        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-2xl">
                            <Image 
                                src={AppoitmentImage} 
                                alt="Gerenciamento de Tratamentos" 
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                data-ai-hint="dental treatment plan" 
                            />
                        </div>
                        <CardTitle className="mt-4 text-lg sm:text-xl text-blue-900 font-bold">Gerenciamento de Tratamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm sm:text-base">
                            Crie e organize planos de tratamento personalizados para cada paciente de forma eficiente.
                        </CardDescription>
                    </CardContent>
                </Card>
                 <Card className="rounded-2xl shadow-xl hover:shadow-2xl border-0 bg-white/90 transition-shadow duration-300 group">
                    <CardHeader className="pb-4">
                        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-t-2xl">
                            <Image 
                                src={SmartAppoitment} 
                                alt="Agendamento de Consultas" 
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                data-ai-hint="calendar schedule appointment" 
                            />
                        </div>
                        <CardTitle className="mt-4 text-lg sm:text-xl text-blue-900 font-bold">Agendamento Inteligente</CardTitle>
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

      <footer className="border-t py-4 sm:py-6 md:py-8 bg-white/80">
        <div className="container flex flex-col items-center justify-center gap-2 sm:gap-4 md:h-16 md:flex-row px-4">
          <p className="text-balance text-center text-xs sm:text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} OdontoApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
