/**
 * AINative Client - Main Entry Point
 */

// Runtime exports
export { createAIApp, AIApp } from './runtime/app';
export type { AppConfig, ActionOptions } from './runtime/app';

export { AIStateManager } from './runtime/state';
export type { AIState, Message, StateListener } from './runtime/state';

export { EventBus } from './runtime/events';
export type {
  AIEvent,
  EventType,
  EventListener,
  ActionEvent,
  ToolEvent,
  StreamEvent,
} from './runtime/events';

export { StreamingEngine } from './runtime/streaming';
export type { StreamConfig, StreamMessage } from './runtime/streaming';

export { AIReconciler } from './runtime/reconciler';
export type { StatePatch, ReconcileOptions } from './runtime/reconciler';

export { AIRenderer } from './runtime/renderer';
export type { RenderOptions } from './runtime/renderer';

// Error exports
export {
  AINativeError,
  StreamingError,
  ReconciliationError,
  ConnectionError,
  ProviderError,
  ActionError,
} from './runtime/errors';

// Multimodal exports
export { AudioRecorder, AudioPlayer } from './multimodal/audio';
export type { AudioConfig, AudioRecording } from './multimodal/audio';

export { ImageHandler, pasteImageFromClipboard } from './multimodal/image';
export type { ImageConfig, ProcessedImage } from './multimodal/image';

export {
  FileUploader,
  formatFileSize,
  getFileExtension,
  isImageFile,
  isVideoFile,
  isAudioFile,
} from './multimodal/file';
export type { FileConfig, ProcessedFile } from './multimodal/file';

// Component exports
export { AIApp as AIAppComponent } from './components/AIApp';
export { AIInput } from './components/AIInput';
export { AIStream, AIStreamList } from './components/AIStream';
export { AIPane } from './components/AIPane';

export type { AIAppProps } from './components/AIApp';
export type { AIInputProps } from './components/AIInput';
export type { AIStreamProps, AIStreamListProps } from './components/AIStream';
export type { AIPaneProps } from './components/AIPane';
