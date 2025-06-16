'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockAppointments, mockClients, mockTreatments } from "@/lib/mock-data";
import { CalendarCheck, Users, ClipboardList, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const upcomingAppointments = mockAppointments.filter(
    (appt) => appt.status === 'scheduled' && new Date(appt.date) >= new Date()
  ).length;
  const totalClients = mockClients.length;
  const totalTreatments = mockTreatments.length;
  
  // A simplistic way to calculate potential revenue from upcoming scheduled appointments
  const potentialRevenue = mockAppointments
    .filter(appt => appt.status === 'scheduled' && new Date(appt.date) >= new Date())
    .reduce((sum, appt) => {
      const treatment = mockTreatments.find(t => t.id === appt.treatmentId);
      return sum + (treatment?.price || 0);
    }, 0);

  const summaryCards = [
    { title: "Consultas Agendadas", value: upcomingAppointments, icon: CalendarCheck, description: "Próximas consultas", link: "/dashboard/appointments" },
    { title: "Total de Clientes", value: totalClients, icon: Users, description: "Clientes cadastrados", link: "/dashboard/clients" },
    { title: "Tipos de Tratamento", value: totalTreatments, icon: ClipboardList, description: "Serviços oferecidos", link: "/dashboard/treatments" },
    { title: "Receita Potencial", value: `R$ ${potentialRevenue.toFixed(2)}`, icon: DollarSign, description: "Das próximas consultas", link: "/dashboard/appointments" },
  ];

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
      
      {/* Placeholder for future charts or more detailed summaries */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Atividade Recente</CardTitle>
            <CardDescription>Um resumo das atividades recentes na clínica.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Em breve: Gráficos de agendamentos, novos clientes, etc.</p>
            {/* Example: List recent appointments */}
            <ul className="mt-4 space-y-2">
              {mockAppointments.slice(0, 3).map(appt => (
                <li key={appt.id} className="text-sm">
                  <span className="font-semibold">{appt.clientName}</span> - {appt.treatmentName} em {new Date(appt.date).toLocaleDateString('pt-BR')}
                </li>
              ))}
            </ul>
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
