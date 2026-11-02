import { Lock } from "lucide-react";
import { BuySlotsButton } from "./buy-slots-button";
import type { PlanInfo } from "@/models/plan";

export function PlanLimitNotice({ plan }: { plan: PlanInfo }) {
  return (
    <div className="max-w-xl rounded-lg border border-amber-300 bg-amber-50 p-6 space-y-3">
      <div className="flex items-center gap-2 text-amber-800 font-semibold">
        <Lock size={18} />
        Limite de produtos atingido
      </div>
      <p className="text-sm text-amber-900">
        Seu plano permite até <strong>{plan.productLimit}</strong> produtos cadastrados e esse
        limite já foi atingido ({plan.productCount}/{plan.productLimit}). Para cadastrar mais
        produtos, libere mais {plan.slotPackSize} vagas.
      </p>
      <BuySlotsButton slotPackSize={plan.slotPackSize} />
    </div>
  );
}
