import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Painel Administrativo - RC Soluções" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 px-4">
      <div className="w-full max-w-sm bg-background rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/images/logo-marca-dark.png"
            alt="RC Soluções"
            width={64}
            height={64}
          />
          <h1 className="text-xl font-bold mt-4">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Entre com seu e-mail e senha para gerenciar produtos e parceiros.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
