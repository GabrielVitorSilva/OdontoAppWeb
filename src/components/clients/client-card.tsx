import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{client.name}</CardTitle>
        <CardDescription>Informações de contato e ações rápidas.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Mail className="w-4 h-4 mr-2 text-primary" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Phone className="w-4 h-4 mr-2 text-primary" />
          <span>{client.phone}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t pt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/clients/${client.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Link>
        </Button>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(client)} aria-label="Editar">
                <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)} aria-label="Excluir" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
