/** Client-only canvas helper used by the admin image-crop inputs. */

export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.src = src;
  });
}

// Lado maior da imagem já recortada, em pixels. Fotos de celular costumam vir com 3000–4000px de
// lado, bem mais do que qualquer card ou banner do site precisa — sem esse limite, o recorte podia
// gerar um arquivo enorme (às vezes maior que o original) e estourar o limite de tamanho do
// formulário na hospedagem.
const MAX_OUTPUT_DIMENSION = 1600;

/** Crops `src` to the given pixel area and returns the result as a File (same name/mime type). */
export async function cropImageToFile(
  src: string,
  crop: PixelCrop,
  fileName: string,
  mimeType: string
): Promise<File> {
  const image = await loadImage(src);

  const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(crop.width, crop.height));
  const outputWidth = Math.round(crop.width * scale);
  const outputHeight = Math.round(crop.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem neste navegador.");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Falha ao gerar imagem recortada."))),
      mimeType,
      0.92
    );
  });

  return new File([blob], fileName, { type: mimeType });
}
