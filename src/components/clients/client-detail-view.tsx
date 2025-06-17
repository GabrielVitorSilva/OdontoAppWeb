import type { Client, Appointment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, CalendarDays, MapPin, ListChecks, History, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClientSummarySection } from "./client-summary-section";
import { Badge } from "../ui/badge";
import { useAuth } from "@/contexts/auth-context";

interface ClientDetailViewProps {
  client: Client;
  appointments: Appointment[]; // Past appointments for this client
}

function getInitials(name: string) {
  const names = name.split(' ');
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
}
const {user} = useAuth()
console.log('User in ClientDetailView:', user);
export function ClientDetailView({ client, appointments }: ClientDetailViewProps) {
  const clientAppointments = appointments.filter(appt => appt.clientId === client.id)
    .sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  // Combine provided medical history and structured treatment history for AI summary
  let combinedHistoryForAI = client.medicalHistory || "";
  if (client.treatmentHistory && client.treatmentHistory.length > 0) {
    combinedHistoryForAI += "\n\nTratamentos Realizados:\n";
    client.treatmentHistory.forEach(th => {
      combinedHistoryForAI += `- ${th.treatmentName} em ${format(parseISO(th.date), "dd/MM/yyyy", { locale: ptBR })}: ${th.notes}\n`;
    });
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-20 w-20 text-xl">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user?.user.User.name ?? '')}`} alt={client.name} data-ai-hint="person avatar" />
            <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-3xl font-headline">{client.name}</CardTitle>
            <CardDescription>ID do Cliente: {client.id}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-primary" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-primary" />
            <span>{client.phone}</span>
          </div>
          {client.dateOfBirth && (
            <div className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-3 text-primary" />
              <span>Nascimento: {format(parseISO(client.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-primary" />
              <span>{client.address}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <ClientSummarySection initialHistory={combinedHistoryForAI} clientId={client.id} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><User className="w-5 h-5 mr-2 text-primary" />Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          {client.medicalHistory ? (
            <>
              <h4 className="font-semibold mb-1">Histórico Médico Relevante:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{client.medicalHistory}</p>
            </>
          ) : (
            <p className="text-muted-foreground">Nenhum histórico médico relevante informado.</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><History className="w-5 h-5 mr-2 text-primary" />Histórico de Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          {clientAppointments.length > 0 ? (
            <ul className="space-y-4">
              {clientAppointments.map(appt => (
                <li key={appt.id} className="p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{appt.treatmentName}</span>
                    <Badge variant={appt.status === 'completed' ? 'secondary' : appt.status === 'cancelled' ? 'destructive' : 'default'}>
                      {appt.status === 'completed' ? 'Concluída' : appt.status === 'cancelled' ? 'Cancelada' : 'Agendada'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Data: {format(parseISO(appt.date), "dd/MM/yyyy", { locale: ptBR })} às {appt.time}
                  </p>
                  <p className="text-sm text-muted-foreground">Profissional: {appt.professionalName}</p>
                  {appt.notes && <p className="text-xs mt-1 italic">Obs: {appt.notes}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nenhuma consulta registrada para este cliente.</p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
