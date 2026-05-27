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

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.44 11.05 12 20.5a6 6 0 1 1-8.49-8.49l9.2-9.19a4 4 0 0 1 5.66 5.65l-9.2 9.2a2 2 0 1 1-2.83-2.83l8.48-8.49"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 3c2.5 2.5 4 5.6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.6-4-9s1.5-6.5 4-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m9.5 2 .6 2.1a8.7 8.7 0 0 1 3.8 0L14.5 2l2.2.7-.2 2.2c.6.3 1.2.7 1.8 1.2l2-1 1.1 2-1.8 1.4c.2.6.4 1.2.5 1.9l2.2.6v2.2l-2.2.6c-.1.7-.3 1.3-.5 1.9l1.8 1.4-1.1 2-2-1c-.6.5-1.2.9-1.8 1.2l.2 2.2-2.2.7-.6-2.1a8.7 8.7 0 0 1-3.8 0L9.5 22l-2.2-.7.2-2.2c-.6-.3-1.2-.7-1.8-1.2l-2 1-1.1-2 1.8-1.4a8 8 0 0 1-.5-1.9L1.7 13v-2.2l2.2-.6c.1-.7.3-1.3.5-1.9L2.6 6.9l1.1-2 2 1c.6-.5 1.2-.9 1.8-1.2L7.3 2.7 9.5 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path
        d="m21 16-4.4-4.4a1.5 1.5 0 0 0-2.1 0L9 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13 17-1.6-1.6a1.5 1.5 0 0 0-2.1 0L7 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M6.5 10.5a5.5 5.5 0 1 0 11 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 20h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 18V6m0 0-4.5 4.5M12 6l4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const hasContent = Boolean(message.trim()) || attachments.length > 0;
  const handlePrimaryAction = async () => {
    if (disabled) {
      return;
    }

    if (isRecording) {
      await handleAudioRecord();
      return;
    }

    if (hasContent) {
      handleSubmit();
      return;
    }

    if (enableAudio) {
      await handleAudioRecord();
    }
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
                <span style={srOnlyStyle}>Remove attachment</span>
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
                  aria-label="Attach files"
                >
                  <PaperclipIcon />
                  <span style={srOnlyStyle}>Attach files</span>
                </button>
              )}

              {enableFile && modes.length > 0 ? <span className="ai-input-divider" aria-hidden="true" /> : null}
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
                  title={getModeLabel(mode)}
                  aria-label={getModeLabel(mode)}
                >
                  {mode === 'search' ? <GlobeIcon /> : null}
                  {mode === 'think' ? <GearIcon /> : null}
                  {mode === 'canvas' ? <ImageIcon /> : null}
                  <span style={srOnlyStyle}>{getModeLabel(mode)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-input-toolbar-right">
            {footerHint ? <span className="ain-chip">{footerHint}</span> : null}
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={disabled}
              className="ai-input-submit"
              title={
                isRecording
                  ? 'Stop recording'
                  : hasContent
                    ? 'Send message'
                    : enableAudio
                      ? 'Record audio'
                      : 'Send message'
              }
              aria-label={
                isRecording
                  ? 'Stop recording'
                  : hasContent
                    ? 'Send message'
                    : enableAudio
                      ? 'Record audio'
                      : 'Send message'
              }
            >
              {isRecording ? <StopIcon /> : hasContent || !enableAudio ? <ArrowUpIcon /> : <MicIcon />}
              <span style={srOnlyStyle}>
                {isRecording ? 'Stop recording' : hasContent ? 'Send message' : 'Record audio'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
