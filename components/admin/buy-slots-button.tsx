"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BuySlotsButton({ slotPackSize }: { slotPackSize: number }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Falha ao iniciar pagamento.");
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao iniciar pagamento.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} className="gap-2">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
      Comprar mais {slotPackSize} vagas
    </Button>
  );
}
