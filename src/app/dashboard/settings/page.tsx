// src/app/dashboard/settings/page.tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Configurações" description="Ajuste as configurações da aplicação." />
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Aplicação</CardTitle>
          <CardDescription>Esta página está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em breve você poderá ajustar as configurações do OdontoApp aqui.</p>
        </CardContent>
      </Card>
    </>
  );
}
