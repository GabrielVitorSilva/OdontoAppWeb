
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile, type fetchAllUsersByIdResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Mail, ShieldCheck, Trash2, UserCircle, Briefcase, User as UserIcon } from "lucide-react";

interface UserCardProps {
  user: fetchAllUsersByIdResponse;
  onEdit: (user: fetchAllUsersByIdResponse) => void;
  onDelete: (userId: string) => void;
  currentUserId: string;
}

export function UserCard({ user, onEdit, onDelete, currentUserId }: UserCardProps) {
  const RoleIcon = user.User.role === Profile.ADMIN ? ShieldCheck : user.User.role === Profile.PROFESSIONAL ? Briefcase : UserIcon;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserCircle className="w-10 h-10 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl">{user.User.name}</CardTitle>
            <CardDescription className="flex items-center">
              <RoleIcon className="w-4 h-4 mr-1.5 text-muted-foreground" />
              {
              user.User.role === Profile.ADMIN ? 'Administrador' : user.User.role === Profile.CLIENT ? 'Cliente' :
               "Profissional"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Mail className="w-4 h-4 mr-2 text-primary" />
          <span>{user.User.email}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(user.User.id)}
          disabled={user.User.id === currentUserId}
          title={user.User.id === currentUserId ? "Não pode excluir a própria conta" : "Excluir usuário"}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
