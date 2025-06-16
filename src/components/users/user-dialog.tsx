
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const userSchemaBase = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de email inválido."),
  role: z.enum(['admin', 'professional'], "Selecione um tipo de usuário válido (Admin ou Profissional)."),
});

const newUserSchema = userSchemaBase.extend({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Confirme a senha."),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

const editUserSchema = userSchemaBase; // Password not directly editable here

type NewUserFormValues = z.infer<typeof newUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;
type UserFormValues = NewUserFormValues | EditUserFormValues;


interface UserDialogProps {
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: User) => void;
}

export function UserDialog({ user, open, onOpenChange, onSave }: UserDialogProps) {
  const { toast } = useToast();
  const isEditing = !!user;

  const { control, register, handleSubmit, reset, watch, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? editUserSchema : newUserSchema),
    defaultValues: {
        name: "",
        email: "",
        role: "professional",
        password: "",
        confirmPassword: "",
    }
  });

  useEffect(() => {
    if (open) { // Reset form only when dialog opens or user prop changes
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          role: user.role as 'admin' | 'professional', // Ensure role is one of the allowed types
          // Password fields are not pre-filled for editing
        });
      } else {
        reset({
          name: "",
          email: "",
          role: "professional",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [user, open, reset]);

  const onSubmit = (data: UserFormValues) => {
    let userDataToSave: User;

    if (isEditing && user) {
        // For editing, we don't include password fields from the form
        const editData = data as EditUserFormValues;
        userDataToSave = {
            ...user, // existing user data including id and original password
            name: editData.name,
            email: editData.email,
            role: editData.role,
        };
    } else {
        // For new user, include password
        const newData = data as NewUserFormValues;
        userDataToSave = {
            id: `user-${Date.now()}`, // Temporary ID, real app would get from backend
            name: newData.name,
            email: newData.email,
            role: newData.role,
            password: newData.password, // Store password for new user (in mock data)
        };
    }
    
    // Prevent changing role of root admin
    if (isEditing && user?.email === 'gabrieldatas2004@gmail.com' && user.role === 'admin' && userDataToSave.role !== 'admin') {
      toast({
        title: "Ação Inválida",
        description: "Não é possível alterar o tipo de usuário da conta root.",
        variant: "destructive",
      });
      return;
    }


    onSave(userDataToSave);
    toast({
        title: isEditing ? "Usuário Atualizado!" : "Usuário Criado!",
        description: `O usuário "${data.name}" foi salvo com sucesso.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados do usuário." : "Preencha os dados do novo usuário."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} disabled={isEditing && user?.email === 'gabrieldatas2004@gmail.com'}/>
             {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          
          {!isEditing && (
            <>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive mt-1">{(errors.password as any).message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{(errors.confirmPassword as any).message}</p>}
              </div>
            </>
          )}

          <div>
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isEditing && user?.email === 'gabrieldatas2004@gmail.com' && user.role === 'admin'}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
