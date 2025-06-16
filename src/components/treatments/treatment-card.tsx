import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Treatment } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, DollarSign } from "lucide-react";

interface TreatmentCardProps {
  treatment: Treatment;
  onEdit: (treatment: Treatment) => void;
  onDelete: (treatmentId: string) => void;
}

export function TreatmentCard({ treatment, onEdit, onDelete }: TreatmentCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{treatment.name}</CardTitle>
        <CardDescription className="line-clamp-3 h-[60px]">{treatment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Clock className="w-4 h-4 mr-2" />
          <span>Duração: {treatment.duration} minutos</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Preço: R$ {treatment.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(treatment)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(treatment.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
