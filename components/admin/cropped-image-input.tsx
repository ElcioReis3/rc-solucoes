"use client";

import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type MediaSize } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadCloud, X, ZoomIn } from "lucide-react";
import { cropImageToFile } from "@/lib/image-crop";
import { cn } from "@/lib/utils";

type PendingImage = { file: File; previewUrl: string };

/** Fixed-ratio presets the admin can pick in the crop modal, besides the photo's own proportions. */
const ASPECT_PRESETS = [
  { label: "Quadrado", value: 1 },
  { label: "Retrato", value: 3 / 4 },
  { label: "Paisagem", value: 4 / 3 },
] as const;

/**
 * The actual crop/zoom UI for a single raw file. Lives in its own component so the parent can
 * force a clean remount (via `key`) whenever the file being cropped changes, instead of
 * resetting crop/zoom state from inside an effect.
 */
function SingleImageCropper({
  file,
  defaultAspect,
  busy,
  onCancel,
  onConfirm,
}: {
  file: File;
  defaultAspect: number;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (croppedAreaPixels: Area) => void;
}) {
  // Object URLs must be created AND revoked inside the effect (not created in render/useMemo
  // with only the revoke in an effect) — otherwise React Strict Mode's dev-mode double-invoke
  // revokes the URL right after mount while the image is still using it, leaving a black box.
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- object URL lifecycle must stay symmetric with its cleanup below
    setActiveSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const [aspect, setAspect] = useState(defaultAspect);
  // The photo's own width/height ratio — known only once react-easy-crop reports it — lets the
  // admin pick "Foto original" to keep the full image (e.g. a tall or wide product package)
  // instead of being forced into one of the fixed presets above.
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const pickAspect = (value: number) => {
    setAspect(value);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleMediaLoaded = (size: MediaSize) => setNaturalAspect(size.width / size.height);

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {ASPECT_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => pickAspect(preset.value)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
              aspect === preset.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted"
            )}
          >
            {preset.label}
          </button>
        ))}
        {naturalAspect && (
          <button
            type="button"
            onClick={() => pickAspect(naturalAspect)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
              aspect === naturalAspect
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted"
            )}
          >
            Foto original
          </button>
        )}
      </div>

      <div className="relative w-full h-72 bg-black/90 rounded-md overflow-hidden">
        {activeSrc && (
          <Cropper
            image={activeSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            onMediaLoaded={handleMediaLoaded}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <ZoomIn size={16} className="text-muted-foreground shrink-0" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Zoom"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
          disabled={busy || !croppedAreaPixels}
        >
          {busy ? "Processando..." : "Usar esta foto"}
        </Button>
      </DialogFooter>
    </>
  );
}

type Props = {
  /** Name of the (hidden, native) file input submitted with the surrounding form. */
  name: string;
  label: string;
  hint?: string;
  /** Initial crop ratio when the modal opens — the admin can still switch presets or pick "Foto original". */
  aspect: number;
  /** How many files this field accepts in total. 1 for a single logo/banner. */
  maxFiles: number;
  disabled?: boolean;
};

/**
 * A file picker that opens a crop/zoom preview (react-easy-crop) for every image before it's
 * attached to the form, instead of submitting whatever file the OS file picker returned.
 * Keeps the final, already-cropped files in a hidden native <input type="file"> so the
 * surrounding <form>'s plain `new FormData(form)` picks them up exactly like before.
 */
export function CroppedImageInput({ name, label, hint, aspect, maxFiles, disabled }: Props) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const pickerInputRef = useRef<HTMLInputElement>(null);

  // `queueVersion` forces SingleImageCropper to remount (fresh crop/zoom state) every time the
  // front of the queue changes, even if a same-named file gets queued again later.
  const [queue, setQueue] = useState<File[]>([]);
  const [queueVersion, setQueueVersion] = useState(0);
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [busy, setBusy] = useState(false);

  const remaining = maxFiles - pending.length;

  // Keeps the hidden native input's FileList in sync with the cropped results, so the
  // surrounding form's FormData submits them exactly like a normal file input would.
  useEffect(() => {
    const input = hiddenInputRef.current;
    if (!input) return;
    const transfer = new DataTransfer();
    pending.forEach((p) => transfer.items.add(p.file));
    input.files = transfer.files;
  }, [pending]);

  useEffect(() => {
    return () => pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, remaining);
    if (pickerInputRef.current) pickerInputRef.current.value = "";
    if (files.length > 0) {
      setQueue((q) => [...q, ...files]);
      setQueueVersion((v) => v + 1);
    }
  };

  const advanceQueue = () => {
    setQueue((q) => q.slice(1));
    setQueueVersion((v) => v + 1);
  };

  const confirmCurrent = async (croppedAreaPixels: Area) => {
    const current = queue[0];
    if (!current) return;
    setBusy(true);
    try {
      const src = URL.createObjectURL(current);
      try {
        const cropped = await cropImageToFile(
          src,
          croppedAreaPixels,
          current.name,
          current.type || "image/jpeg"
        );
        setPending((p) => [...p, { file: cropped, previewUrl: URL.createObjectURL(cropped) }]);
      } finally {
        URL.revokeObjectURL(src);
      }
      advanceQueue();
    } finally {
      setBusy(false);
    }
  };

  const removePending = (index: number) => {
    setPending((p) => {
      URL.revokeObjectURL(p[index].previewUrl);
      return p.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <UploadCloud size={16} />
        {label}
      </Label>

      <input ref={hiddenInputRef} type="file" name={name} multiple={maxFiles > 1} className="hidden" />
      <input
        ref={pickerInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={maxFiles > 1}
        disabled={disabled || remaining <= 0}
        onChange={handlePick}
        className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-muted disabled:opacity-50"
      />

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {pending.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {pending.map((p, i) => (
            <div key={p.previewUrl} className="relative w-20 h-20 rounded-md border overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.previewUrl} alt={`Pré-visualização ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePending(i)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                aria-label="Remover esta foto"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={queue.length > 0} onOpenChange={(open) => !open && advanceQueue()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto</DialogTitle>
            <DialogDescription>
              Escolha a proporção, arraste para posicionar e use o zoom para ajustar o
              enquadramento antes de anexar.
            </DialogDescription>
          </DialogHeader>

          {queue[0] && (
            <SingleImageCropper
              key={queueVersion}
              file={queue[0]}
              defaultAspect={aspect}
              busy={busy}
              onCancel={advanceQueue}
              onConfirm={confirmCurrent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
