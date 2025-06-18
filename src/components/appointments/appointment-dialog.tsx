'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockTreatments } from "@/lib/mock-data";
import { AppointmentStatus, Profile, type Appointment, type fetchProfessionalAndClient, type Treatment } from "@/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/services/api";
import { useAuth } from "@/contexts/auth-context";


export const appointmentSchema = z.object({
  id: z.string().uuid(), 
  clientName: z.string().min(1, "Nome do cliente é obrigatório."),
  professionalName: z.string().min(1, "Nome do profissional é obrigatório."),
  treatmentName: z.string().min(1, "Nome do tratamento é obrigatório."),
  dateTime: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Data e hora inválidas (use formato ISO 8601 ou similar)." }
  ),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)."),
  status: z.nativeEnum(AppointmentStatus),
});


type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentDialogProps {
  appointment?: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Appointment) => void;
  children?: React.ReactNode;
}

export function AppointmentDialog({ appointment, open, onOpenChange, onSave, children }: AppointmentDialogProps) {
  const {user} = useAuth();

  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<fetchProfessionalAndClient[]>([]);
  const [clients, setClients] = useState<fetchProfessionalAndClient[]>([]);
  const [treatment, setTreatments] = useState<Treatment[]>([]);
  
  const [clientSelected, setClientSelected] = useState<fetchProfessionalAndClient>();
  const [professionalSelected, setProfessionalSelected] = useState<fetchProfessionalAndClient>();
  const [treatmentSelected, setTreatmentSelected] = useState<Treatment>();

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  async function fetchProfessionalsData() {
    try {
      const response = await api.get('/professionals');
      setProfessionals(response.data.professionals);
    } catch (error:any) {
      console.error("Erro ao buscar profissionais:", error);
      toast({
        title: "Erro ao buscar profissionais",
        description: error.response?.message,
        variant: "destructive",
      });
    }
  }

  async function fetchClientsData() {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (error:any) {
      console.error("Erro ao buscar clientes:", error);
      toast({
        title: "Erro ao buscar clientes",
        description: error.response?.message,
        variant: "destructive",
      });
    }
  }

  async function fetchTreatmentsData() {
    try {
      const response = await api.get(`/treatments`);
      console.log("Tratamentos:", response.data.treatments);
      setTreatments(response.data.treatments);
    } catch (error:any) {
      console.error("Erro ao buscar consultas:", error);
      toast({
        title: "Erro ao buscar consultas",
        description: error.response?.message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchProfessionalsData();
    fetchClientsData();
    fetchTreatmentsData();
  }, []);

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.dateTime);
      reset({
        id: appointment.id,
        clientName: appointment.clientName || "",
        professionalName: appointment.professionalName || "",
        treatmentName: appointment.treatmentName || "",
        dateTime: appointment.dateTime || new Date().toISOString(),
        time: format(appointmentDate, 'HH:mm'),
        status: appointment.status,
      });
    } else {
      reset({
        id: crypto.randomUUID(),
        clientName: "",
        professionalName: "",
        treatmentName: "",
        dateTime: new Date().toISOString(),
        time: "09:00",
        status: AppointmentStatus.SCHEDULED,
      });
    }
  }, [appointment, reset, open]);

  async function appointmentRegister({dateTime, time, status}:AppointmentFormValues){
    try {
      const date = new Date(dateTime);
      const [hours, minutes] = time.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const values = {
        clientId: clientSelected?.clientId,
        professionalId: professionalSelected?.professionalId,
        treatmentId: treatmentSelected?.id,
        dateTime: date.toISOString(),
        status
      }
      const response = await api.post('/consultations', values)
      toast({
        title: "Consulta registrada com sucesso",
        description: "A consulta foi registrada com sucesso.",
        variant: "default",
      });
      onSave(response.data);
    } catch (error:any) {
      console.error("Erro ao registrar consulta:", error);
      toast({
        title: "Erro ao registrar consulta",
        description: error.response?.message || "Ocorreu um erro ao registrar a consulta.",
        variant: "destructive",
      });
    }
  }

  async function appointmentUpdate({dateTime, time, status}:AppointmentFormValues){
    try {
      const date = new Date(dateTime);
      const [hours, minutes] = time.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const values = {
        clientId: clientSelected?.clientId,
        professionalId: professionalSelected?.professionalId,
        dateTime: date.toISOString(),
        status
      }
      const response = await api.patch(`/consultations/${treatmentSelected?.id}`, values)
      toast({
        title: "Consulta registrada com sucesso",
        description: "A consulta foi registrada com sucesso.",
        variant: "default",
      });
      onSave(response.data);
    } catch (error:any) {
      console.error("Erro ao atualizar consulta:", error);
      toast({
        title: "Erro ao atualizar consulta",
        description: error.response?.message || "Ocorreu um erro ao atualizar a consulta.",
        variant: "destructive",
      });
    }
  }
  const onSubmit = (data: AppointmentFormValues) => {
  if (appointment) {
      appointmentUpdate(data);
    } else {
      appointmentRegister(data);
    }
  };

  const availableTimes = Array.from({ length: (18 - 9) * 2 + 1 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">{appointment ? "Editar Consulta" : "Nova Consulta"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Atualize os detalhes da consulta." : "Preencha os detalhes para agendar uma nova consulta."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <Controller name="clientName" control={control} render={({ field }) => (
            <div>
              <Label htmlFor="clientName">Cliente</Label>
              <Select onValueChange={(value) => {
                field.onChange(value);
                const selectedClient = clients.find(client => client.name === value);
                if (selectedClient) {
                  setClientSelected(selectedClient);
                }
              }} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientName && <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>}
            </div>
          )} />

          <Controller name="professionalName" control={control} render={({ field }) => (
             <div>
              <Label htmlFor="professionalName">Profissional</Label>
              <Select onValueChange={(value) => {
                field.onChange(value);
                const selectedProf = professionals.find(prof => prof.name === value);
                if (selectedProf) {
                  setProfessionalSelected(selectedProf);
                }
              }} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um profissional" /></SelectTrigger>
                <SelectContent>
                  {professionals.map((prof: fetchProfessionalAndClient) => (
                    <SelectItem key={prof.id} value={prof.name}>{prof.name} - {prof.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.professionalName && <p className="text-sm text-destructive mt-1">{errors.professionalName.message}</p>}
            </div>
          )} />

          <Controller name="treatmentName" control={control} render={({ field }) => (
            <div>
              <Label htmlFor="treatmentName">Tratamento</Label>
              <Select onValueChange={(value) => {
                field.onChange(value);
                const selectedTreatment = treatment.find(t => t.name === value);
                if (selectedTreatment) {
                  setTreatmentSelected(selectedTreatment);
                }
              }} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um tratamento" /></SelectTrigger>
                <SelectContent>
                  {treatment.map(treatment => (
                    <SelectItem key={treatment.id} value={treatment.name}>{treatment.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.treatmentName && <p className="text-sm text-destructive mt-1">{errors.treatmentName.message}</p>}
            </div>
          )} />
          
          <div className="grid grid-cols-2 gap-4">
            <Controller name="dateTime" control={control} render={({ field }) => (
              <div>
                <Label htmlFor="dateTime">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={field.value ? new Date(field.value) : undefined} 
                      onSelect={(date) => field.onChange(date?.toISOString())} 
                      initialFocus 
                      locale={ptBR} 
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateTime && <p className="text-sm text-destructive mt-1">{errors.dateTime.message}</p>}
              </div>
            )} />

            <Controller name="time" control={control} render={({ field }) => (
              <div>
                <Label htmlFor="time">Hora</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="HH:MM" /></SelectTrigger>
                  <SelectContent>
                    {availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
              </div>
            )} />
          </div>

          <Controller name="status" control={control} render={({ field }) => (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AppointmentStatus.SCHEDULED}>Agendada</SelectItem>
                  <SelectItem value={AppointmentStatus.COMPLETED}>Concluída</SelectItem>
                  <SelectItem value={AppointmentStatus.CANCELED}>Cancelada</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>
          )} />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar Consulta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
