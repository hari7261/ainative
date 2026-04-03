/**
 * File upload and processing utilities
 */

export interface FileConfig {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
}

export interface ProcessedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  base64?: string;
  url?: string;
}

export class FileUploader {
  /**
   * Open file picker dialog
   */
  async pick(config: FileConfig = {}): Promise<ProcessedFile[]> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = config.multiple || false;

      if (config.allowedTypes && config.allowedTypes.length > 0) {
        input.accept = config.allowedTypes.join(',');
      }

      input.onchange = async () => {
        if (!input.files || input.files.length === 0) {
          resolve([]);
          return;
        }

        try {
          const files = Array.from(input.files);
          const processed = await this.processFiles(files, config);
          resolve(processed);
        } catch (error) {
          reject(error);
        }
      };

      input.oncancel = () => resolve([]);
      input.click();
    });
  }

  /**
   * Handle drag and drop files
   */
  async handleDrop(event: DragEvent, config: FileConfig = {}): Promise<ProcessedFile[]> {
    event.preventDefault();

    const items = event.dataTransfer?.items;
    const files: File[] = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }
    }

    return this.processFiles(files, config);
  }

  /**
   * Process multiple files
   */
  async processFiles(files: File[], config: FileConfig = {}): Promise<ProcessedFile[]> {
    const processed: ProcessedFile[] = [];

    for (const file of files) {
      if (!this.validateFile(file, config)) {
        continue;
      }

      const processedFile = await this.processFile(file);
      processed.push(processedFile);
    }

    return processed;
  }

  /**
   * Process single file
   */
  private async processFile(file: File): Promise<ProcessedFile> {
    const url = URL.createObjectURL(file);
    const base64 = await this.fileToBase64(file);

    return {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      base64,
      url,
    };
  }

  /**
   * Validate file against config
   */
  private validateFile(file: File, config: FileConfig): boolean {
    if (config.maxSize && file.size > config.maxSize) {
      console.warn(`File ${file.name} exceeds maximum size`);
      return false;
    }

    if (config.allowedTypes && config.allowedTypes.length > 0) {
      const isAllowed = config.allowedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category + '/');
        }
        return file.type === type;
      });

      if (!isAllowed) {
        console.warn(`File ${file.name} type ${file.type} is not allowed`);
        return false;
      }
    }

    return true;
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Check if file is image
 */
export function isImageFile(file: File | ProcessedFile): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is video
 */
export function isVideoFile(file: File | ProcessedFile): boolean {
  return file.type.startsWith('video/');
}

/**
 * Check if file is audio
 */
export function isAudioFile(file: File | ProcessedFile): boolean {
  return file.type.startsWith('audio/');
}
