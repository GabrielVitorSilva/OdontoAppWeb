import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment } from "@/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, Edit, Stethoscope, Tag, Trash2, User } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export function AppointmentCard({ appointment, onEdit, onDelete }: AppointmentCardProps) {
  const formattedDate = format(parseISO(appointment.date), "PPP", { locale: ptBR });
  
  const statusVariant = {
    scheduled: "default",
    completed: "secondary", // Consider a success-like color from theme if available or a custom one
    cancelled: "destructive",
  } as const;
  
  const statusText = {
    scheduled: "Agendada",
    completed: "Concluída",
    cancelled: "Cancelada",
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg mb-1">{appointment.treatmentName || "Tratamento não especificado"}</CardTitle>
          <Badge variant={statusVariant[appointment.status]}>{statusText[appointment.status]}</Badge>
        </div>
        <CardDescription className="text-sm flex items-center">
            <User className="w-4 h-4 mr-2 text-primary"/> {appointment.clientName || "Cliente não especificado"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Stethoscope className="w-4 h-4 mr-2" />
          <span>Profissional: {appointment.professionalName || "N/A"}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>Data: {formattedDate}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>Hora: {appointment.time}</span>
        </div>
        {appointment.notes && (
          <div className="pt-2">
            <p className="text-xs font-semibold">Observações:</p>
            <p className="text-xs text-muted-foreground italic line-clamp-2">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(appointment)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(appointment.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
