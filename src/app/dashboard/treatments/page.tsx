
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockTreatments } from "@/lib/mock-data";
import { Profile, type Treatment } from "@/types";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { TreatmentDialog } from "@/components/treatments/treatment-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";

export default function TreatmentsPage() {
  const { user } = useAuth(); 
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setTreatments(mockTreatments);
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

  const handleDelete = (treatmentId: string) => {
    if (!isAdmin) return; 
    if (window.confirm("Tem certeza que deseja excluir este tratamento?")) {
      setTreatments(prev => prev.filter(t => t.id !== treatmentId));
      toast({
        title: "Tratamento Excluído!",
        description: "O tratamento foi excluído com sucesso.",
        variant: "destructive",
      });
    }
  };

  const handleSave = (data: Treatment) => {
    if (!isAdmin) return; 
    if (selectedTreatment) {
      setTreatments(prev => prev.map(t => t.id === data.id ? data : t));
    } else {
      setTreatments(prev => [...prev, data]);
    }
    setSelectedTreatment(null);
  };

  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Gerenciamento de Tratamentos" description="Visualize os tratamentos oferecidos. Administradores podem criar e editar.">
        {isAdmin && ( 
          <Button onClick={handleAddNew}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Tratamento
          </Button>
        )}
      </PageHeader>

      <div className="mb-6">
        <Input
          placeholder="Buscar tratamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredTreatments.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]"> 
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {filteredTreatments.map((treatment) => (
              <TreatmentCard 
                key={treatment.id} 
                treatment={treatment} 
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
              />
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
    </>
  );
}
