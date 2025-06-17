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
import { fetchAllUsersByIdResponse, Profile, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const userSchemaBase = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de email inválido."),
  role: z.enum([Profile.ADMIN, Profile.PROFESSIONAL, Profile.CLIENT], {
    errorMap: () => ({ message: "Selecione um tipo de usuário válido (Admin ou Profissional)." })
  }),
});

const newUserSchema = userSchemaBase.extend({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Confirme a senha."),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

const editUserSchema = userSchemaBase;

type FormValues = {
  name: string;
  email: string;
  role: Profile;
  password?: string;
  confirmPassword?: string;
};

interface UserDialogProps {
  user?: fetchAllUsersByIdResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: User) => void;
}

export function UserDialog({ user, open, onOpenChange, onSave }: UserDialogProps) {
  const { toast } = useToast();
  const isEditing = !!user;

  const { control, register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(isEditing ? editUserSchema : newUserSchema),
    defaultValues: isEditing ? {
      name: user.User.name,
      email: user.User.email,
      role: user.User.role,
    } : {
      name: "",
      email: "",
      role: Profile.PROFESSIONAL,
      password: "",
      confirmPassword: "",
    }
  });

  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          name: user.User.name,
          email: user.User.email,
          role: user.User.role,
        });
      } else {
        reset({
          name: "",
          email: "",
          role: Profile.PROFESSIONAL,
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [user, open, reset]);

  const onSubmit = (data: FormValues) => {
    try {
      const userData: User = {
        user: {
          User: {
            id: user?.User.id || "",
            name: data.name,
            email: data.email,
            role: data.role,
          },
          profileData: user?.profileData || {
            id: "",
            userId: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }
      };
      onSave(userData);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar usuário",
        description: "Ocorreu um erro ao tentar salvar o usuário.",
        variant: "destructive",
      });
    }
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
            <Input id="email" type="email" {...register("email")} disabled={isEditing && user?.User.email === 'gabrieldatas2004@gmail.com'}/>
             {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          
          {!isEditing && (
            <>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" {...register("password")} />
                {!isEditing && errors.password && <p className="text-sm text-destructive mt-1">{(errors as any).password?.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {!isEditing && errors.confirmPassword && <p className="text-sm text-destructive mt-1">{(errors as any).confirmPassword?.message}</p>}
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
                    disabled={isEditing && user.User.role === Profile.ADMIN} 
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
