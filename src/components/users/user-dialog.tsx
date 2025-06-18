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
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { formatCPF } from "../auth/signup-form";
import { Eye, EyeOff } from 'lucide-react';

const userSchemaBase = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de email inválido."),
  cpf: z.string(),
  role: z.enum([Profile.ADMIN, Profile.PROFESSIONAL, Profile.CLIENT], {
    errorMap: () => ({ message: "Selecione um tipo de usuário válido (Admin ou Profissional)." })
  }),
});

const newUserSchema = userSchemaBase.extend({
  password: z.string()
  .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
  .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
  .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula." })
  .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
  .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um caractere especial." }),
  confirmPassword: z.string().min(6, "Confirme a senha."),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

const editUserSchema = userSchemaBase;

type FormValues = {
  name: string;
  email: string;
  cpf: string;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { control, register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(isEditing ? editUserSchema : newUserSchema),
    defaultValues: isEditing ? {
      name: user.User.name,
      email: user.User.email,
      role: user.User.role,
      cpf: user.User.cpf
    } : {
      name: "",
      email: "",
      role: Profile.PROFESSIONAL,
      password: "",
      cpf: "",
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
          cpf: formatCPF(user.User.cpf)
        });
      } else {
        reset({
          name: "",
          email: "",
          role: Profile.PROFESSIONAL,
          password: "",
          cpf: "",
          confirmPassword: "",
        });
      }
    }
  }, [user, open, reset]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setValue('cpf', formattedValue);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const values = {
        name: data.name,
        email: data.email,
        role: data.role,
        cpf: data.cpf.replace(/\D/g, ''),
        password: '123@Senha'
      }
      if (isEditing && user) {
        const response = await api.put(`/users/${user.User.id}`, values);
        console.log("User updated:", response.data);
        toast({
          title: "Usuário atualizado com sucesso!",
          description: "As alterações foram salvas.",
          variant: "default",
        });
        onSave(response.data.user);
      } else {
        const response = await api.post("/register", values);
        toast({
          title: "Cadastro de usuário realizado com sucesso!",
          description: "Usuário criado com sucesso.",
          variant: "default",
        });
        onSave(response.data.user);
      }
      onOpenChange(false);
    } catch (error:any) {
      console.error("Error saving user:", error.response?.data.message || error.message);
      if(error.response?.data?.message) {
        toast({
          title: "Erro ao salvar usuário",
          description: error.response.data.message,
          variant: "destructive",
        });
        return
      }
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")}/>
             {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Cpf</Label>
            <Input id="cpf" type="cpf" {...register("cpf")} onChange={handleCPFChange}/>
             {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>}
          </div>
          
          {!isEditing && (
            <>
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    {...register("password")} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {!isEditing && errors.password && <p className="text-sm text-destructive mt-1">{(errors as any).password?.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    {...register("confirmPassword")} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
                    <SelectItem value={Profile.PROFESSIONAL}>Profissional</SelectItem>
                    <SelectItem value={Profile.ADMIN}>Administrador</SelectItem>
                    <SelectItem value={Profile.CLIENT}>Cliente</SelectItem>
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
