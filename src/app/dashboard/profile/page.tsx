// src/app/dashboard/profile/page.tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Meu Perfil" description="Visualize e edite suas informações pessoais." />
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Esta página está em desenvolvimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em breve você poderá gerenciar seu perfil aqui.</p>
        </CardContent>
      </Card>
    </>
  );
}
