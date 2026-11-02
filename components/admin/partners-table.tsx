"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePartnerAction, togglePartnerActiveAction } from "@/app/admin/(dashboard)/partners/actions";
import type { PartnerCompany } from "@/models/partner";

export function PartnersTable({ partners }: { partners: PartnerCompany[] }) {
  const [pending, startTransition] = useTransition();

  if (partners.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-10 text-center">
        Nenhuma empresa parceira cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-3">Logo</th>
            <th className="p-3">Empresa</th>
            <th className="p-3">Visível</th>
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id} className="border-t">
              <td className="p-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
                </div>
              </td>
              <td className="p-3 font-medium">{partner.name}</td>
              <td className="p-3">
                <Switch
                  checked={partner.active}
                  disabled={pending}
                  onCheckedChange={(checked) =>
                    startTransition(() => togglePartnerActiveAction(partner.id, checked))
                  }
                />
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon-sm" asChild>
                    <Link href={`/admin/partners/${partner.id}`} aria-label="Editar">
                      <Pencil size={14} />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon-sm" aria-label="Excluir">
                        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir &quot;{partner.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação remove a empresa parceira e suas imagens permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => startTransition(() => deletePartnerAction(partner.id))}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
