'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockClients } from "@/lib/mock-data";
import type { Client } from "@/types";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ClientCard } from "@/components/clients/client-card";
import { ClientDialog } from "@/components/clients/client-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setClients(mockClients);
  }, []);

  const handleAddNew = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente? Todas as suas consultas associadas também podem ser afetadas.")) {
      setClients(prev => prev.filter(c => c.id !== clientId));
      toast({
        title: "Cliente Excluído!",
        description: "O cliente foi excluído com sucesso.",
        variant: "destructive",
      });
    }
  };

  const handleSave = (data: Client) => {
    if (selectedClient) {
      setClients(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
      setClients(prev => [...prev, data]);
    }
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <>
      <PageHeader title="Gerenciamento de Clientes" description="Adicione, edite e visualize os dados dos seus pacientes.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </PageHeader>

      <div className="mb-6">
        <Input
          placeholder="Buscar clientes (nome, email, telefone)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredClients.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height as needed */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {filteredClients.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">Nenhum cliente encontrado.</p>
          {searchTerm && <p className="text-sm text-muted-foreground">Tente ajustar sua busca.</p>}
        </div>
      )}

      <ClientDialog
        client={selectedClient}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </>
  );
}
