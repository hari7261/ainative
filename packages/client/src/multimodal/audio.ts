/**
 * Audio recording and processing utilities
 */

export interface AudioConfig {
  sampleRate?: number;
  channels?: number;
  mimeType?: string;
}

export interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
  base64?: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;

  async start(config: AudioConfig = {}): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: config.sampleRate || 44100,
          channelCount: config.channels || 1,
        },
      });

      const mimeType = this.getSupportedMimeType(config.mimeType);
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

      this.audioChunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error(`Failed to start audio recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async stop(): Promise<AudioRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const duration = Date.now() - this.startTime;
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder!.mimeType });
        const url = URL.createObjectURL(blob);
        const base64 = await this.blobToBase64(blob);

        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve({ blob, url, duration, base64 });
      };

      this.mediaRecorder.stop();
    });
  }

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  isPaused(): boolean {
    return this.mediaRecorder?.state === 'paused';
  }

  private getSupportedMimeType(preferred?: string): string {
    const types = [
      preferred,
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
    ].filter(Boolean);

    for (const type of types) {
      if (type && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return '';
  }

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
 * Audio playback utilities
 */
export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;

  play(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audio = new Audio(url);
      this.audio.onended = () => resolve();
      this.audio.onerror = () => reject(new Error('Audio playback failed'));
      this.audio.play().catch(reject);
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  pause(): void {
    this.audio?.pause();
  }

  resume(): void {
    this.audio?.play();
  }
}
