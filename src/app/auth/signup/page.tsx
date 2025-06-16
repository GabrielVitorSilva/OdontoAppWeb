import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/ui/logo";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
      <div className="mb-8">
         <Logo iconSize={40} textSize="text-3xl" />
      </div>
      <SignupForm />
    </div>
  );
}
