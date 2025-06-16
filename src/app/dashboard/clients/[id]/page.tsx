'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockClients, mockAppointments } from "@/lib/mock-data"; // Assuming mockAppointments exists
import type { Client, Appointment } from "@/types";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClientDetailView } from "@/components/clients/client-detail-view";
import { ClientDialog } from "@/components/clients/client-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]); // All appointments
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    const foundClient = mockClients.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
      // Fetch all appointments - in a real app this might be filtered by client on backend
      setAppointments(mockAppointments); 
    } else {
      // Handle client not found, e.g., redirect or show error
      toast({ title: "Cliente não encontrado", variant: "destructive" });
      router.push("/dashboard/clients");
    }
    setLoading(false);
  }, [clientId, router, toast]);

  const handleSaveClient = (updatedClient: Client) => {
    setClient(updatedClient);
    // In a real app, update mockClients or make API call
    const clientIndex = mockClients.findIndex(c => c.id === updatedClient.id);
    if (clientIndex > -1) {
      mockClients[clientIndex] = updatedClient;
    }
    setIsEditDialogOpen(false);
    toast({ title: "Cliente atualizado!", description: `${updatedClient.name} foi atualizado com sucesso.` });
  };
  
  if (loading) {
    return (
      <>
        <PageHeader title="Carregando Detalhes do Cliente...">
            <Skeleton className="h-10 w-24" />
        </PageHeader>
        <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </>
    );
  }

  if (!client) {
    // This case should be handled by useEffect redirect, but as a fallback:
    return <PageHeader title="Cliente não encontrado" />;
  }

  return (
    <>
      <PageHeader title={client.name} description={`Detalhes e histórico de ${client.name}`}>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/clients">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Clientes
                </Link>
            </Button>
            <Button onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Cliente
            </Button>
        </div>
      </PageHeader>
      
      <ClientDetailView client={client} appointments={appointments} />

      <ClientDialog
        client={client}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveClient}
      />
    </>
  );
}
