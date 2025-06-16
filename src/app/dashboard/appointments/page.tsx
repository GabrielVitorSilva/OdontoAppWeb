'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockAppointments } from "@/lib/mock-data";
import type { Appointment } from "@/types";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { AppointmentDialog } from "@/components/appointments/appointment-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isFuture, isPast, isToday } from "date-fns";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setAppointments(mockAppointments.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime() || a.time.localeCompare(b.time)));
  }, []);

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta consulta?")) {
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      toast({
        title: "Consulta Excluída!",
        description: "A consulta foi excluída com sucesso.",
        variant: "destructive",
      });
    }
  };

  const handleSave = (data: Appointment) => {
    if (selectedAppointment) {
      setAppointments(prev => prev.map(a => a.id === data.id ? data : a).sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime() || a.time.localeCompare(b.time)));
    } else {
      setAppointments(prev => [...prev, data].sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime() || a.time.localeCompare(b.time)));
    }
    setSelectedAppointment(null);
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;
    if (activeTab === "upcoming") {
      filtered = appointments.filter(appt => (isFuture(parseISO(appt.date)) || isToday(parseISO(appt.date))) && appt.status === 'scheduled');
    } else if (activeTab === "past") {
      filtered = appointments.filter(appt => isPast(parseISO(appt.date)) || appt.status !== 'scheduled');
    } // "all" tab shows all

    return filtered.filter(appointment =>
      appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.professionalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.treatmentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const displayedAppointments = getFilteredAppointments();

  return (
    <>
      <PageHeader title="Gerenciamento de Consultas" description="Agende, edite e visualize as consultas dos pacientes.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Consulta
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Buscar consultas (cliente, profissional, tratamento)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full sm:w-auto"
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="past">Histórico</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {displayedAppointments.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-320px)]"> {/* Adjust height as needed */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {displayedAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">Nenhuma consulta encontrada.</p>
          {searchTerm && <p className="text-sm text-muted-foreground">Tente ajustar sua busca ou filtro.</p>}
        </div>
      )}

      <AppointmentDialog
        appointment={selectedAppointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </>
  );
}
