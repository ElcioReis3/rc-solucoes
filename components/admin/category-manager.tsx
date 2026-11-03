"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Category, SubCategory } from "@/models/category";
import {
  createCategoryAction,
  createSubCategoryAction,
  deleteCategoryAction,
  deleteSubCategoryAction,
  updateCategoryAction,
  updateSubCategoryAction,
} from "@/app/admin/(dashboard)/categories/actions";

type Props = {
  categories: Category[];
  subCategories: SubCategory[];
};

// As actions devolvem { error } em vez de lançar throw quando a validação falha (ver o comentário
// em app/admin/(dashboard)/categories/actions.ts) — por isso o sucesso/erro é lido do retorno, e o
// catch fica só como rede de segurança pra uma falha inesperada (ex.: queda de conexão).
function runAction(fn: () => Promise<{ error: string } | void>, successMsg?: string) {
  fn()
    .then((result) => {
      if (result?.error) toast.error(result.error);
      else if (successMsg) toast.success(successMsg);
    })
    .catch((err) => toast.error(err instanceof Error ? err.message : "Algo deu errado."));
}

export function CategoryManager({ categories, subCategories }: Props) {
  return (
    <div className="space-y-6">
      <NewCategoryForm />

      <div className="space-y-4">
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nenhuma categoria cadastrada ainda.
          </p>
        )}

        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            subCategories={subCategories.filter((s) => s.categorySlug === category.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function NewCategoryForm() {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      runAction(() => createCategoryAction(formData), "Categoria criada.");
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <Input name="name" placeholder="Nome da nova categoria" required />
      <input type="hidden" name="active" value="on" />
      <Button type="submit" disabled={pending} className="gap-1.5 shrink-0">
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        Categoria
      </Button>
    </form>
  );
}

function CategoryCard({
  category,
  subCategories,
}: {
  category: Category;
  subCategories: SubCategory[];
}) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex items-center justify-between gap-3 p-4">
        {editing ? (
          <RenameForm
            defaultValue={category.name}
            onCancel={() => setEditing(false)}
            onSubmit={(formData) => {
              startTransition(() => {
                formData.set("active", category.active ? "on" : "off");
                runAction(() => updateCategoryAction(category.id, formData));
                setEditing(false);
              });
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-semibold flex items-center gap-2 hover:text-primary"
          >
            {category.name}
            <Pencil size={13} className="text-muted-foreground" />
          </button>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <Switch
            checked={category.active}
            disabled={pending}
            onCheckedChange={(checked) =>
              startTransition(() => {
                const fd = new FormData();
                fd.set("name", category.name);
                fd.set("active", checked ? "on" : "off");
                runAction(() => updateCategoryAction(category.id, fd));
              })
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon-sm" disabled={pending}>
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir categoria &quot;{category.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  Só é possível excluir se não houver subcategorias ou produtos usando ela.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    startTransition(() =>
                      runAction(() => deleteCategoryAction(category.id), "Categoria excluída.")
                    )
                  }
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="border-t px-4 py-3 space-y-2 bg-muted/30">
        {subCategories.map((sub) => (
          <SubCategoryRow key={sub.id} subCategory={sub} />
        ))}

        <NewSubCategoryForm categorySlug={category.slug} />
      </div>
    </div>
  );
}

function SubCategoryRow({ subCategory }: { subCategory: SubCategory }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 bg-background rounded-md border px-3 py-2">
      {editing ? (
        <RenameForm
          defaultValue={subCategory.name}
          onCancel={() => setEditing(false)}
          onSubmit={(formData) => {
            startTransition(() => {
              formData.set("categorySlug", subCategory.categorySlug);
              formData.set("active", subCategory.active ? "on" : "off");
              runAction(() => updateSubCategoryAction(subCategory.id, formData));
              setEditing(false);
            });
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm flex items-center gap-2 hover:text-primary"
        >
          {subCategory.name}
          <Pencil size={12} className="text-muted-foreground" />
        </button>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <Switch
          checked={subCategory.active}
          disabled={pending}
          onCheckedChange={(checked) =>
            startTransition(() => {
              const fd = new FormData();
              fd.set("name", subCategory.name);
              fd.set("categorySlug", subCategory.categorySlug);
              fd.set("active", checked ? "on" : "off");
              runAction(() => updateSubCategoryAction(subCategory.id, fd));
            })
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon-sm" disabled={pending}>
              <Trash2 size={13} className="text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir subcategoria &quot;{subCategory.name}&quot;?</AlertDialogTitle>
              <AlertDialogDescription>
                Só é possível excluir se não houver produtos usando ela.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  startTransition(() =>
                    runAction(
                      () => deleteSubCategoryAction(subCategory.id),
                      "Subcategoria excluída."
                    )
                  )
                }
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function NewSubCategoryForm({ categorySlug }: { categorySlug: string }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      runAction(() => createSubCategoryAction(formData), "Subcategoria criada.");
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2 pt-1">
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <input type="hidden" name="active" value="on" />
      <Input name="name" placeholder="Nova subcategoria" required className="h-8 text-sm" />
      <Button type="submit" size="icon-sm" disabled={pending} className="shrink-0">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
      </Button>
    </form>
  );
}

function RenameForm({
  defaultValue,
  onSubmit,
  onCancel,
}: {
  defaultValue: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="flex items-center gap-1.5 flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
    >
      <Input name="name" defaultValue={defaultValue} autoFocus className="h-8 text-sm" />
      <Button type="submit" size="icon-sm" variant="outline">
        <Check size={13} />
      </Button>
      <Button type="button" size="icon-sm" variant="ghost" onClick={onCancel}>
        <X size={13} />
      </Button>
    </form>
  );
}
