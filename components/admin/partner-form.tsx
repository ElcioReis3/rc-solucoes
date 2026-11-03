"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CroppedImageInput } from "./cropped-image-input";
import type { PartnerCompany } from "@/models/partner";

type Props = {
  partner?: PartnerCompany;
  // A action devolve { error } em vez de lançar throw quando a validação falha — ver o comentário
  // em app/admin/(dashboard)/partners/actions.ts sobre por que o Next apaga mensagens de throw.
  action: (formData: FormData) => Promise<{ error: string } | void>;
};

function isRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function PartnerForm({ partner, action }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.error) setError(result.error);
      } catch (err) {
        if (isRedirectError(err)) throw err;
        setError(err instanceof Error ? err.message : "Erro ao salvar empresa.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <Button variant="outline" size="sm" asChild className="gap-1.5 -mt-2">
        <Link href="/admin/partners">
          <ArrowLeft size={15} />
          Voltar
        </Link>
      </Button>

      <div className="space-y-2">
        <Label htmlFor="name">Nome da empresa</Label>
        <Input id="name" name="name" required defaultValue={partner?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Site (opcional)</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          placeholder="https://..."
          defaultValue={partner?.websiteUrl}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch id="active" name="active" defaultChecked={partner?.active ?? true} />
        <Label htmlFor="active">Visível na landing page</Label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          {partner?.logoUrl && (
            <div className="relative w-20 h-20 rounded-md border bg-white overflow-hidden">
              <Image src={partner.logoUrl} alt="Logo atual" fill className="object-contain" />
            </div>
          )}
          <CroppedImageInput
            name="logo"
            label="Logo (quadrada)"
            hint={`JPG, PNG ou WebP, até 5MB.${partner ? " Deixe em branco para manter a logo atual." : ""}`}
            aspect={1}
            maxFiles={1}
          />
        </div>

        <div className="space-y-2">
          {partner?.bannerUrl && (
            <div className="relative w-full h-20 rounded-md border bg-white overflow-hidden">
              <Image src={partner.bannerUrl} alt="Banner atual" fill className="object-cover" />
            </div>
          )}
          <CroppedImageInput
            name="banner"
            label="Banner"
            hint={`JPG, PNG ou WebP, até 5MB.${partner ? " Deixe em branco para manter o banner atual." : ""}`}
            aspect={3}
            maxFiles={1}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="gap-2">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {partner ? "Salvar alterações" : "Criar empresa parceira"}
      </Button>
    </form>
  );
}
