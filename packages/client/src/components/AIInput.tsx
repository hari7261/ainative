import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { AudioRecorder, AudioRecording } from '../multimodal/audio';
import { FileUploader, ProcessedFile, formatFileSize } from '../multimodal/file';
import { ensureAINativeComponentStyles } from './styles';

export type AIInputAttachment =
  | {
      type: 'audio';
      data: AudioRecording;
    }
  | {
      type: 'file';
      data: ProcessedFile;
    };

export interface AIInputSubmitMeta {
  mode: 'default' | 'search' | 'think' | 'canvas';
}

export interface AIInputProps {
  onSubmit: (
    message: string,
    attachments?: AIInputAttachment[],
    meta?: AIInputSubmitMeta
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  enableAudio?: boolean;
  enableFile?: boolean;
  className?: string;
  modes?: Array<'search' | 'think' | 'canvas'>;
  footerHint?: string;
}

export const AIInput: React.FC<AIInputProps> = ({
  onSubmit,
  placeholder = 'Message the assistant',
  disabled = false,
  multiline = true,
  enableAudio = true,
  enableFile = true,
  className = '',
  modes = ['search', 'think', 'canvas'],
  footerHint,
}) => {
  ensureAINativeComponentStyles();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AIInputAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMode, setActiveMode] = useState<AIInputSubmitMeta['mode']>('default');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const audioRecorder = useRef(new AudioRecorder());
  const fileUploader = useRef(new FileUploader());

  useEffect(() => {
    if (!multiline && inputRef.current instanceof HTMLInputElement) {
      inputRef.current.focus();
    }
  }, [multiline]);

  const handleSubmit = () => {
    if (message.trim() || attachments.length > 0) {
      onSubmit(message.trim(), attachments, { mode: activeMode });
      setMessage('');
      setAttachments([]);
      setActiveMode('default');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAudioRecord = async () => {
    if (isRecording) {
      const recording = await audioRecorder.current.stop();
      setAttachments([...attachments, { type: 'audio', data: recording }]);
      setIsRecording(false);
    } else {
      await audioRecorder.current.start();
      setIsRecording(true);
    }
  };

  const handleFileUpload = async () => {
    try {
      const files = await fileUploader.current.pick({
        multiple: true,
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ['image/*', 'application/pdf', 'text/plain'],
      });
      const fileAttachments = files.map((file) => ({ type: 'file' as const, data: file }));
      setAttachments([...attachments, ...fileAttachments]);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getModeLabel = (mode: 'search' | 'think' | 'canvas'): string => {
    switch (mode) {
      case 'search':
        return 'Search';
      case 'think':
        return 'Think';
      case 'canvas':
        return 'Canvas';
    }
  };

  const renderAttachmentLabel = (attachment: AIInputAttachment): string => {
    if (attachment.type === 'audio') {
      const seconds = Math.max(1, Math.round(attachment.data.duration / 1000));
      return `Voice note ${seconds}s`;
    }

    return `${attachment.data.name} (${formatFileSize(attachment.data.size)})`;
  };

  return (
    <div className={`ain-shell ai-input-container ${className}`}>
      {attachments.length > 0 && (
        <div className="ai-input-attachments">
          {attachments.map((attachment, index) => (
            <div key={index} className="ai-input-attachment">
              {attachment.type === 'file' && attachment.data.url && attachment.data.type.startsWith('image/') ? (
                <img src={attachment.data.url} alt={attachment.data.name} className="ai-input-preview" />
              ) : null}
              <span className="ai-input-attachment-name">{renderAttachmentLabel(attachment)}</span>
              <button
                type="button"
                className="ain-secondary-button"
                onClick={() => removeAttachment(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="ai-input-main">
        {isRecording ? (
          <div className="ain-voice-note">Recording voice note. Press Record again to attach it.</div>
        ) : null}

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="ai-input-field"
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="ai-input-field"
          />
        )}

        <div className="ai-input-toolbar">
          <div className="ai-input-toolbar-left">
            <div className="ai-input-actions">
              {enableFile && (
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={disabled}
                  className="ai-input-btn"
                  title="Attach files"
                >
                  Attach
                </button>
              )}

              {enableAudio && (
                <button
                  type="button"
                  onClick={handleAudioRecord}
                  disabled={disabled}
                  className="ai-input-btn"
                  title="Record audio"
                >
                  {isRecording ? 'Stop recording' : 'Record'}
                </button>
              )}
            </div>

            <div className="ai-input-actions">
              {modes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className="ain-mode-toggle"
                  data-active={activeMode === mode}
                  onClick={() => setActiveMode(activeMode === mode ? 'default' : mode)}
                  disabled={disabled}
                >
                  {getModeLabel(mode)}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-input-toolbar-right">
            {footerHint ? <span className="ain-chip">{footerHint}</span> : null}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={disabled || (!message.trim() && attachments.length === 0)}
              className="ai-input-submit"
            >
              {isRecording ? 'Attach note' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
