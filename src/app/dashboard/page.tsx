'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarCheck, Users, ClipboardList, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Statistics } from "@/types/statistics";

export default function DashboardPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const summaryCards = [
    { 
      title: "Consultas Agendadas", 
      value: statistics?.scheduledConsultations ?? 0, 
      icon: CalendarCheck, 
      description: "Próximas consultas", 
      link: "/dashboard/appointments" 
    },
    { 
      title: "Total de Clientes", 
      value: statistics?.totalClients ?? 0, 
      icon: Users, 
      description: "Clientes cadastrados", 
      link: "/dashboard/clients" 
    },
    { 
      title: "Tipos de Tratamento", 
      value: statistics?.totalTreatments ?? 0, 
      icon: ClipboardList, 
      description: "Serviços oferecidos", 
      link: "/dashboard/treatments" 
    },
    { 
      title: "Receita Potencial", 
      value: `R$ ${(statistics?.potentialRevenue ?? 0).toFixed(2)}`, 
      icon: DollarSign, 
      description: "Das próximas consultas", 
      link: "/dashboard/appointments" 
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col gap-10 py-10 px-4 md:px-10">
      <h1 className="text-4xl font-extrabold font-headline text-blue-900 drop-shadow-sm tracking-tight mb-4">Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, idx) => (
          <Card
            key={card.title}
            className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/90 hover:bg-blue-50 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold font-headline text-blue-900 group-hover:text-blue-700 transition-colors">
                {card.title}
              </CardTitle>
              <card.icon
                className={
                  `h-8 w-8 ` +
                  (idx === 0 ? 'text-blue-500' : idx === 1 ? 'text-emerald-500' : idx === 2 ? 'text-yellow-500' : 'text-green-600') +
                  ' drop-shadow-sm transition-colors'
                }
              />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold mb-1 group-hover:scale-105 transition-transform" style={{letterSpacing: '-1px'}}>{card.value}</div>
              <p className="text-xs text-muted-foreground pt-1 mb-2">{card.description}</p>
              <Button variant="link" asChild className="p-0 mt-2 text-sm text-blue-700 hover:text-blue-900">
                <Link href={card.link}>Ver mais</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="rounded-2xl shadow-md border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="font-headline text-green-700 text-lg">Receita Total</CardTitle>
            <CardDescription className="text-gray-500">Valor total arrecadado pela clínica.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-green-600 drop-shadow-sm">
              R$ {(statistics?.totalRevenue ?? 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="font-headline text-blue-700 text-lg">Lembretes</CardTitle>
            <CardDescription className="text-gray-500">Notificações e tarefas pendentes importantes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Em breve: Lembretes de confirmação, aniversários, etc.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
