'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Treatment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const treatmentSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  duration: z.coerce.number().int().positive("A duração deve ser um número positivo."),
  price: z.coerce.number().positive("O preço deve ser um número positivo."),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

interface TreatmentDialogProps {
  treatment?: Treatment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Treatment) => void;
  children?: React.ReactNode; // For the trigger button
}

export function TreatmentDialog({ treatment, open, onOpenChange, onSave, children }: TreatmentDialogProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: treatment || { name: "", description: "", duration: 30, price: 0 },
  });

  useEffect(() => {
    if (treatment) {
      reset(treatment);
    } else {
      reset({ name: "", description: "", duration: 30, price: 0 });
    }
  }, [treatment, reset, open]);


  const onSubmit = (data: TreatmentFormValues) => {
    onSave({ ...treatment, id: treatment?.id || `treat-${Date.now()}`, ...data });
    toast({
        title: treatment ? "Tratamento Atualizado!" : "Tratamento Criado!",
        description: `O tratamento "${data.name}" foi salvo com sucesso.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{treatment ? "Editar Tratamento" : "Novo Tratamento"}</DialogTitle>
          <DialogDescription>
            {treatment ? "Atualize os detalhes do tratamento." : "Preencha os detalhes do novo tratamento."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Nome do Tratamento</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input id="duration" type="number" {...register("duration")} />
              {errors.duration && <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>}
            </div>
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar Tratamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
