'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Profile, type Treatment } from "@/types";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { TreatmentDialog } from "@/components/treatments/treatment-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import api from "@/services/api";

export default function TreatmentsPage() {
  const { user } = useAuth(); 
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  async function fetchTreatments() {
    try {
      const response = await api.get("/treatments");
      
      const data = response.data.treatments as Treatment[];
      console.log(data);
      if (Array.isArray(data)) {
        setTreatments(data);
      }
    } catch (error) {
      console.error("Erro ao buscar tratamentos:", error);
      toast({
        title: "Erro ao buscar tratamentos",
        description: "Não foi possível carregar os tratamentos no momento.",
        variant: "destructive",
      });
      setTreatments([]); 
    }
  }
  useEffect(() => {
    fetchTreatments()
  }, []);

  const isAdmin = user?.user.User.role === Profile.ADMIN;

  const handleAddNew = () => {
    if (!isAdmin) return; 
    setSelectedTreatment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (treatment: Treatment) => {
    if (!isAdmin) return; 
    setSelectedTreatment(treatment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (treatmentId: string) => {
    if (!isAdmin) return; 
    if (window.confirm("Tem certeza que deseja excluir este tratamento?")) {
      try {
        await api.delete(`/treatments/${treatmentId}`);
        await fetchTreatments();
        toast({
          title: "Tratamento Excluído!",
          description: "O tratamento foi excluído com sucesso.",
          variant: "destructive",
        });
      } catch (error: any) {
        console.error("Erro ao excluir tratamento:", error);
        if( error.response?.status === 409) {
          toast({
            title: "Erro ao excluir tratamento",
            description: error.response?.data?.message || "Este tratamento está vinculado a agendamentos e não pode ser excluído.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Erro ao excluir tratamento",
          description: "Não foi possível excluir o tratamento. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (data: Treatment) => {
    if (!isAdmin) return; 
    try {
      await fetchTreatments(); 
      setSelectedTreatment(null);
    } catch (error) {
      console.error("Erro ao atualizar lista de tratamentos:", error);
      toast({
        title: "Erro ao atualizar lista",
        description: "Não foi possível atualizar a lista de tratamentos.",
        variant: "destructive",
      });
    }
  };

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-4 md:px-10">
      <PageHeader title="Gerenciamento de Tratamentos" description="Visualize os tratamentos oferecidos. Administradores podem criar e editar.">
        {isAdmin && (
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md px-5 py-2 flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Novo Tratamento
          </Button>
        )}
      </PageHeader>

      <div className="mb-8 flex justify-between items-center">
        <Input
          placeholder="Buscar tratamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm rounded-lg shadow-sm border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>
      
      {filteredTreatments.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {filteredTreatments.map((treatment) => (
              <div className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/90 border-0 group">
                <TreatmentCard 
                  key={treatment.id} 
                  treatment={treatment} 
                  onEdit={isAdmin ? handleEdit : undefined}
                  onDelete={isAdmin ? handleDelete : undefined}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">Nenhum tratamento encontrado.</p>
          {searchTerm && <p className="text-sm text-muted-foreground">Tente ajustar sua busca.</p>}
        </div>
      )}

      {isAdmin && (
        <TreatmentDialog
          treatment={selectedTreatment}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
