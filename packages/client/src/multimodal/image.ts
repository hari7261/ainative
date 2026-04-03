/**
 * Image capture and processing utilities
 */

export interface ImageConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImage {
  blob: Blob;
  url: string;
  base64: string;
  width: number;
  height: number;
}

export class ImageHandler {
  /**
   * Capture image from camera
   */
  async captureFromCamera(config: ImageConfig = {}): Promise<ProcessedImage> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: config.maxWidth || 1920 },
          height: { ideal: config.maxHeight || 1080 },
        },
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;

      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0);

      stream.getTracks().forEach((track) => track.stop());

      return this.canvasToImage(canvas, config);
    } catch (error) {
      throw new Error(`Failed to capture image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process image file
   */
  async processFile(file: File, config: ImageConfig = {}): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = this.resizeImage(img, config);
          const result = await this.canvasToImage(canvas, config);
          resolve(result);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Process image from URL
   */
  async processUrl(url: string, config: ImageConfig = {}): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        const canvas = this.resizeImage(img, config);
        const result = await this.canvasToImage(canvas, config);
        resolve(result);
      };

      img.onerror = () => reject(new Error('Failed to load image from URL'));
      img.src = url;
    });
  }

  /**
   * Convert canvas to image data
   */
  private async canvasToImage(canvas: HTMLCanvasElement, config: ImageConfig): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      const format = config.format || 'jpeg';
      const mimeType = `image/${format}`;
      const quality = config.quality || 0.9;

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          const url = URL.createObjectURL(blob);
          const base64 = await this.blobToBase64(blob);

          resolve({
            blob,
            url,
            base64,
            width: canvas.width,
            height: canvas.height,
          });
        },
        mimeType,
        quality
      );
    });
  }

  /**
   * Resize image maintaining aspect ratio
   */
  private resizeImage(img: HTMLImageElement, config: ImageConfig): HTMLCanvasElement {
    const maxWidth = config.maxWidth || img.width;
    const maxHeight = config.maxHeight || img.height;

    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;

      if (width > height) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);

    return canvas;
  }

  /**
   * Convert blob to base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

/**
 * Paste image from clipboard
 */
export async function pasteImageFromClipboard(): Promise<ProcessedImage | null> {
  try {
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const file = new File([blob], 'clipboard-image', { type });
          const handler = new ImageHandler();
          return handler.processFile(file);
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to paste image:', error);
    return null;
  }
}
