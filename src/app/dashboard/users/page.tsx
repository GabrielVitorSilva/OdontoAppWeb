'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/mock-data";
import { Profile, type fetchAllUsersByIdResponse, type fetchAllUsersResponse, type User } from "@/types";
import { PlusCircle, ShieldAlert, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { UserCard } from "@/components/users/user-card";
import { UserDialog } from "@/components/users/user-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/services/api";

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<fetchAllUsersByIdResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<fetchAllUsersByIdResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchUserById(userId: string) {
    try {
      const response = await api.get(`/users/${userId}`);
      const userData = response.data.user as fetchAllUsersByIdResponse;
      return userData;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      toast({
        title: "Erro ao buscar usuário",
        description: "Não foi possível carregar os dados do usuário.",
        variant: "destructive",
      });
      return null;
    }
  }

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const response = await api.get("/users");
      const data = response.data.users as fetchAllUsersResponse[];
      let AllUsers: fetchAllUsersByIdResponse[] = [];
      for (const user of data) {
        const userData = await fetchUserById(user.id);
        if (userData) {
          AllUsers.push(userData);
        }
      }
      setUsers(AllUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        title: "Erro ao buscar usuários",
        description: "Não foi possível carregar os usuários no momento.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();

    if (!authLoading) {
      if (!user || !user.user) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        router.push("/dashboard");
      } else if (user.user.User.role  === Profile.ADMIN) {
        fetchUsers();
      }
    }
  }, [authLoading, user, router, toast]);

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (userToEdit: fetchAllUsersByIdResponse) => {
    console.log("Editing user:", userToEdit);
    setSelectedUser(userToEdit);
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.status === 200) {
        setUsers(users.filter(user => user.profileData.id !== userId));
        toast({
          title: "Usuário excluído com sucesso",
          description: "O usuário foi removido da lista.",
          variant: "default",
        });
      }
    } catch (error:any) {
      console.error("Erro ao excluir usuário:", error.response?.data);
      toast({
        title: "Erro ao excluir usuário",
        description: error.response?.data?.message || "Não foi possível excluir o usuário.",
        variant: "destructive",
      });

    }
  };

  const handleSave = async (data: User) => {
    try {
      await fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar lista de usuários:", error);
    }
  };
  
  const filteredUsers = users.filter(user =>
    user.User.id && (
      (user.User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.User.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );
  console.log("Filtered Users:", filteredUsers);
  if (authLoading) {
    return <div className="flex justify-center items-center h-full"><p>Carregando...</p></div>;
  }

  if (user?.user.User.role !== Profile.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="items-center">
            <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
            <CardTitle className="text-2xl text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Você não tem permissão para visualizar esta página.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="w-full mt-6">
              Voltar para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Gerenciamento de Usuários" description="Adicione, edite e visualize usuários administradores e profissionais.">
        <Button onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </PageHeader>

      <div className="mb-6">
        <Input
          placeholder="Buscar usuários (nome, email)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-280px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Carregando usuários...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {filteredUsers.map((data) => (
              <UserCard 
                key={data.User.role} 
                user={data} 
                onEdit={handleEdit}
                onDelete={() => {handleDelete(data.User.id)}}
                currentUserId={user.user.User.id}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">Nenhum usuário encontrado.</p>
          {searchTerm && <p className="text-sm text-muted-foreground">Tente ajustar sua busca.</p>}
        </div>
      )}

      <UserDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </>
  );
}
