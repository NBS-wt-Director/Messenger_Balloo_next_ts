/**
 * Утилита для оптимизации изображений
 */

// Поддерживаемые форматы
type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

interface ImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  format?: ImageFormat;
}

const defaultOptions: ImageOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  format: 'webp',
};

/**
 * Оптимизировать изображение
 */
export async function optimizeImage(
  file: File,
  options: Partial<ImageOptions> = {}
): Promise<{ blob: Blob; width: number; height: number; size: number }> {
  const { maxWidth, maxHeight, quality, format } = { ...defaultOptions, ...options };
  
  // Создание изображения
  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  
  // Изменение размера если нужно
  if ((maxWidth && width > maxWidth) || (maxHeight && height > maxHeight)) {
    const ratio = Math.min(
      maxWidth ? maxWidth / width : Infinity, 
      maxHeight ? maxHeight / height : Infinity
    );
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }
  
  // Создание canvas для оптимизации
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  
  // Конвертация в нужный формат
  const blob = await canvas.convertToBlob({
    type: `image/${format}`,
    quality: quality,
  });
  
  return {
    blob,
    width,
    height,
    size: blob.size,
  };
}

/**
 * Создать thumbnail изображения
 */
export async function createThumbnail(
  file: File,
  size: number = 200
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  
  // Вычисление размеров
  let width = bitmap.width;
  let height = bitmap.height;
  
  if (width > height) {
    if (width > size) {
      height = Math.floor(height * (size / width));
      width = size;
    }
  } else {
    if (height > size) {
      width = Math.floor(width * (size / height));
      height = size;
    }
  }
  
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  
  const blob = await canvas.convertToBlob({
    type: 'image/webp',
    quality: 0.7,
  });
  
  return {
    blob,
    width,
    height,
  };
}

/**
 * Проверка типа изображения
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Проверка размера изображения
 */
export function validateImageSize(file: File, maxSizeMB: number = 5): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

/**
 * Получить метаданные изображения
 */
export async function getImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  type: string;
  size: number;
}> {
  const bitmap = await createImageBitmap(file);
  return {
    width: bitmap.width,
    height: bitmap.height,
    type: file.type,
    size: file.size,
  };
}

/**
 * Конвертировать изображение в WebP
 */
export async function convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  
  return await canvas.convertToBlob({
    type: 'image/webp',
    quality,
  });
}
