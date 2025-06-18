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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{card.description}</p>
              <Button variant="link" asChild className="p-0 mt-2 text-sm">
                <Link href={card.link}>Ver mais</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Receita Total</CardTitle>
            <CardDescription>Valor total arrecadado pela clínica.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {(statistics?.totalRevenue ?? 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Lembretes</CardTitle>
            <CardDescription>Notificações e tarefas pendentes importantes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Em breve: Lembretes de confirmação, aniversários, etc.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
