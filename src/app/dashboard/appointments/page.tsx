'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { AppointmentDialog } from "@/components/appointments/appointment-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";
import { useAuth } from "@/contexts/auth-context";

export default function AppointmentsPage() {
  const {user} = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();


  async function fetchAppointments() {
    try {
      const response = await api.get(`/users/${user?.user.User.id}/consultations`);
      setAppointments(response.data.consultations);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      if(error.response?.data?.message) {
        toast({
          title: "Erro ao buscar consultas",
          description: error.response.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Erro ao buscar consultas",
        description: error.response?.data?.message || "Ocorreu um erro ao buscar as consultas.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    console.log("Editing appointment:", appointment);
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (appointmentId: string) => {
    const response = await api.delete(`/consultations/${appointmentId}`);
    console.log("Delete response:", response);
    if (response.status === 204) {
      setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
      toast({
        title: "Consulta removida",
        description: "A consulta foi removida com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao remover consulta",
        description: "Ocorreu um erro ao remover a consulta.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (data: Appointment) => {
    try {
      await fetchAppointments(); 
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar lista de tratamentos:", error);
      toast({
        title: "Erro ao atualizar lista",
        description: "Não foi possível atualizar a lista de tratamentos.",
        variant: "destructive",
      });
    }
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;
    // if (activeTab === "upcoming") {
    //   filtered = appointments.filter(appt => (isFuture(parseISO(appt.date)) || isToday(parseISO(appt.date))) && appt.status === 'scheduled');
    // } else if (activeTab === "past") {
    //   filtered = appointments.filter(appt => isPast(parseISO(appt.date)) || appt.status !== 'scheduled');
    // } // "all" tab shows all

    return filtered.filter(appointment =>
      appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.professionalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.treatmentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const displayedAppointments = getFilteredAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-4 md:px-10">
      <PageHeader title="Gerenciamento de Consultas" description="Agende, edite e visualize as consultas dos pacientes.">
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md px-5 py-2 flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Nova Consulta
        </Button>
      </PageHeader>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Buscar consultas (cliente, profissional, tratamento)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full sm:w-auto rounded-lg shadow-sm border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>
      
      {displayedAppointments.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {displayedAppointments.map((appointment) => (
              <div className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/90 border-0 group">
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onEdit={handleEdit}
                  onDelete={() => {handleDelete(appointment.id)}}
                />
              </div>
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
    </div>
  );
}
