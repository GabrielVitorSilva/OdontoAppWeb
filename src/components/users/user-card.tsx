
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Mail, ShieldCheck, Trash2, UserCircle, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  currentUserId: string;
}

export function UserCard({ user, onEdit, onDelete, currentUserId }: UserCardProps) {
  const roleText = {
    admin: "Administrador",
    professional: "Profissional",
    client: "Cliente", // Should not appear here ideally
  };

  const RoleIcon = user.role === 'admin' ? ShieldCheck : Briefcase;

  const isRootAdmin = user.email === 'gabrieldatas2004@gmail.com';


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserCircle className="w-10 h-10 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center">
              <RoleIcon className="w-4 h-4 mr-1.5 text-muted-foreground" />
              {roleText[user.role]}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Mail className="w-4 h-4 mr-2 text-primary" />
          <span>{user.email}</span>
        </div>
        {isRootAdmin && (
            <Badge variant="secondary" className="mt-2">Conta Root</Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(user.id)}
          disabled={user.id === currentUserId || isRootAdmin}
          title={isRootAdmin ? "Conta root não pode ser excluída" : user.id === currentUserId ? "Não pode excluir a própria conta" : "Excluir usuário"}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
