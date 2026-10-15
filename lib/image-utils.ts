import imageCompression from 'browser-image-compression';

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/webp', 0.92);
  });
}

export interface CompressionResult {
  file: File;
  originalSizeKB: number;
  compressedSizeKB: number;
  savingsPercent: number;
}

export async function compressImage(
  fileOrBlob: File | Blob,
  fileName: string,
  maxSizeMB = 0.5,
  maxWidthOrHeight = 1200
): Promise<CompressionResult> {
  const originalSizeKB = Math.round(fileOrBlob.size / 1024);

  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.82,
  };

  const fileToCompress =
    fileOrBlob instanceof File
      ? fileOrBlob
      : new File([fileOrBlob], fileName, { type: 'image/webp' });

  let compressedBlob: Blob;
  try {
    compressedBlob = await imageCompression(fileToCompress, options);
  } catch (err) {
    console.warn('Compressão falhou ou não suportada, utilizando blob original:', err);
    compressedBlob = fileOrBlob;
  }

  const safeFileName = fileName.endsWith('.webp')
    ? fileName
    : `${fileName.replace(/\.[^/.]+$/, '')}.webp`;

  const compressedFile = new File([compressedBlob], safeFileName, {
    type: 'image/webp',
  });

  const compressedSizeKB = Math.round(compressedFile.size / 1024);
  const savingsPercent =
    originalSizeKB > 0
      ? Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100))
      : 0;

  return {
    file: compressedFile,
    originalSizeKB,
    compressedSizeKB,
    savingsPercent,
  };
}
