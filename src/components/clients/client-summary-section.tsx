'use client';

import { getClientHistorySummary } from '@/app/actions/client-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ClientSummarySectionProps {
  initialHistory?: string;
  clientId: string; // Used for context or future enhancements
}

export function ClientSummarySection({ initialHistory = '', clientId }: ClientSummarySectionProps) {
  const [historyText, setHistoryText] = useState(initialHistory);
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSummarize = () => {
    if (!historyText.trim()) {
      toast({
        title: "Histórico Vazio",
        description: "Por favor, insira o histórico do cliente para gerar o resumo.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      setSummary(null); // Clear previous summary
      const result = await getClientHistorySummary({ history: historyText });
      if ('error' in result) {
        toast({
          title: "Erro ao Gerar Resumo",
          description: result.error,
          variant: "destructive",
        });
        setSummary(null);
      } else {
        setSummary(result.summary);
        toast({
          title: "Resumo Gerado!",
          description: "O resumo do histórico do cliente foi gerado com sucesso.",
        });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Wand2 className="w-5 h-5 mr-2 text-primary" />
          Resumo Inteligente do Histórico
        </CardTitle>
        <CardDescription>
          Utilize IA para gerar um resumo conciso do histórico do cliente. Cole ou digite o histórico abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`client-history-${clientId}`} className="mb-2 block">Histórico do Cliente</Label>
          <Textarea
            id={`client-history-${clientId}`}
            value={historyText}
            onChange={(e) => setHistoryText(e.target.value)}
            placeholder="Insira aqui o histórico completo do cliente, incluindo tratamentos passados, notas, queixas, etc."
            rows={8}
            className="min-h-[150px]"
          />
        </div>
        <Button onClick={handleSummarize} disabled={isPending || !historyText.trim()} className="w-full sm:w-auto">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Gerando Resumo..." : "Gerar Resumo com IA"}
        </Button>

        {summary && (
          <Alert className="mt-4 bg-primary/5 border-primary/20">
            <Wand2 className="h-4 w-4 !text-primary" /> {/* Ensure icon color contrast */}
            <AlertTitle className="font-headline text-primary">Resumo Gerado</AlertTitle>
            <AlertDescription className="prose prose-sm max-w-none text-foreground/90">
              <p>{summary}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
