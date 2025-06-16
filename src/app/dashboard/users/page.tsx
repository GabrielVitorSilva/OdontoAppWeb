
'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/mock-data";
import type { User } from "@/types";
import { PlusCircle, ShieldAlert } from "lucide-react";
import React, { useState, useEffect } from "react";
import { UserCard } from "@/components/users/user-card";
import { UserDialog } from "@/components/users/user-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && currentUser?.role !== 'admin') {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      router.push("/dashboard");
    } else if (!authLoading && currentUser?.role === 'admin') {
      // Filter to show only 'admin' and 'professional' users for management
      setUsers(mockUsers.filter(u => u.role === 'admin' || u.role === 'professional'));
    }
  }, [currentUser, authLoading, router, toast]);

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (currentUser?.id === userId) {
      toast({
        title: "Ação Inválida",
        description: "Você não pode excluir sua própria conta.",
        variant: "destructive",
      });
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      const userToDelete = mockUsers.find(u => u.id === userId);
      if (userToDelete?.email === 'gabrieldatas2004@gmail.com') {
          toast({
            title: "Ação Inválida",
            description: "A conta root do administrador não pode ser excluída.",
            variant: "destructive",
          });
          return;
      }
      
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        mockUsers.splice(userIndex, 1);
        setUsers(mockUsers.filter(u => u.role === 'admin' || u.role === 'professional'));
        toast({
          title: "Usuário Excluído!",
          description: "O usuário foi excluído com sucesso.",
        });
      }
    }
  };

  const handleSave = (data: User) => {
    const existingUserIndex = mockUsers.findIndex(u => u.id === data.id);
    if (existingUserIndex > -1) { // Editing existing user
      mockUsers[existingUserIndex] = { ...mockUsers[existingUserIndex], ...data, password: mockUsers[existingUserIndex].password }; // Keep original password if not changed
    } else { // Adding new user
      const newUserId = `user-${Date.now()}`;
      mockUsers.push({ ...data, id: newUserId });
    }
    setUsers(mockUsers.filter(u => u.role === 'admin' || u.role === 'professional'));
    setSelectedUser(null);
  };
  
  const filteredUsers = users.filter(user =>
    (user.role === 'admin' || user.role === 'professional') &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading) {
    return <div className="flex justify-center items-center h-full"><p>Carregando...</p></div>;
  }

  if (currentUser?.role !== 'admin') {
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
      
      {filteredUsers.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
            {filteredUsers.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={currentUser.id}
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
