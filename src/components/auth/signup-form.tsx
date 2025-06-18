'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Profile } from "@/types";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Use o formato 123.456.789-10." }),
  password: z.string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
    .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
    .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula." })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um caractere especial." }),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  
  const limitedNumbers = numbers.slice(0, 11);
  
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
};

async function registerUser(data: SignupFormValues) {
  try {
    const dataRegister = {
      name: data.name,
      email: data.email,
      cpf: data.cpf.replace(/\D/g, ''), 
      password: data.password,
    }
    const response = await api.post('/register/client', dataRegister);
    console.log('User registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; 
  }
}

export function SignupForm() {
  const { toast } = useToast()
  const router = useRouter();
  const { login } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setValue('cpf', formattedValue);
  };

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const formData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, '')
      };
      await registerUser(formData);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o dashboard.",
        variant: "default",
      });

      login(data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.response?.data?.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Criar Conta de Cliente</CardTitle>
        <CardDescription>Junte-se ao OdontoApp para gerenciar suas consultas.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" placeholder="Seu Nome Completo" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Cpf</Label>
            <Input 
              id="cpf" 
              type="text" 
              placeholder="123.456.789-10" 
              {...register('cpf')}
              onChange={handleCPFChange}
              maxLength={14}
            />
            {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="********" 
                {...register('password')} 
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
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="********" 
                {...register('confirmPassword')} 
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
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full">Criar Conta</Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Button variant="link" asChild className="p-0">
            <Link href="/auth/login">Faça login</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
