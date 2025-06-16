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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockClients, mockProfessionals, mockTreatments } from "@/lib/mock-data";
import type { Appointment } from "@/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  professionalId: z.string().min(1, "Selecione um profissional."),
  treatmentId: z.string().min(1, "Selecione um tratamento."),
  date: z.date({ required_error: "A data da consulta é obrigatória." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:MM)."),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
  notes: z.string().optional(),
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
  const { toast } = useToast();
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      reset({
        ...appointment,
        date: new Date(appointment.date),
      });
    } else {
      reset({
        clientId: "",
        professionalId: "",
        treatmentId: "",
        date: new Date(),
        time: "09:00",
        status: "scheduled",
        notes: "",
      });
    }
  }, [appointment, reset, open]);

  const onSubmit = (data: AppointmentFormValues) => {
    const client = mockClients.find(c => c.id === data.clientId);
    const professional = mockProfessionals.find(p => p.id === data.professionalId);
    const treatment = mockTreatments.find(t => t.id === data.treatmentId);

    const appointmentData: Appointment = {
      ...appointment,
      id: appointment?.id || `appt-${Date.now()}`,
      ...data,
      date: format(data.date, "yyyy-MM-dd"), // Store date as string
      clientName: client?.name,
      professionalName: professional?.name,
      treatmentName: treatment?.name,
    };
    onSave(appointmentData);
    toast({
        title: appointment ? "Consulta Atualizada!" : "Consulta Agendada!",
        description: `A consulta para ${client?.name} foi salva com sucesso.`,
    });
    onOpenChange(false);
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
          <Controller name="clientId" control={control} render={({ field }) => (
            <div>
              <Label htmlFor="clientId">Cliente</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-sm text-destructive mt-1">{errors.clientId.message}</p>}
            </div>
          )} />

          <Controller name="professionalId" control={control} render={({ field }) => (
             <div>
              <Label htmlFor="professionalId">Profissional</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um profissional" /></SelectTrigger>
                <SelectContent>
                  {mockProfessionals.map(prof => <SelectItem key={prof.id} value={prof.id}>{prof.name} - {prof.specialty}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.professionalId && <p className="text-sm text-destructive mt-1">{errors.professionalId.message}</p>}
            </div>
          )} />

          <Controller name="treatmentId" control={control} render={({ field }) => (
            <div>
              <Label htmlFor="treatmentId">Tratamento</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um tratamento" /></SelectTrigger>
                <SelectContent>
                  {mockTreatments.map(treat => <SelectItem key={treat.id} value={treat.id}>{treat.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.treatmentId && <p className="text-sm text-destructive mt-1">{errors.treatmentId.message}</p>}
            </div>
          )} />
          
          <div className="grid grid-cols-2 gap-4">
            <Controller name="date" control={control} render={({ field }) => (
              <div>
                <Label htmlFor="date">Data</Label>
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
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
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
                  <SelectItem value="scheduled">Agendada</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>
          )} />

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" {...register("notes")} placeholder="Alguma observação adicional?"/>
            {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar Consulta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
