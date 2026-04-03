/**
 * AIInput Component
 * Enhanced input with multimodal support
 */

import React, { useState, useRef, KeyboardEvent } from 'react';
import { AudioRecorder } from '../multimodal/audio';
import { ImageHandler } from '../multimodal/image';
import { FileUploader } from '../multimodal/file';

export interface AIInputProps {
  onSubmit: (message: string, attachments?: any[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  enableAudio?: boolean;
  enableImage?: boolean;
  enableFile?: boolean;
  className?: string;
}

export const AIInput: React.FC<AIInputProps> = ({
  onSubmit,
  placeholder = 'Type a message...',
  disabled = false,
  multiline = false,
  enableAudio = true,
  enableImage = true,
  enableFile = true,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const audioRecorder = useRef(new AudioRecorder());
  const imageHandler = useRef(new ImageHandler());
  const fileUploader = useRef(new FileUploader());

  const handleSubmit = () => {
    if (message.trim() || attachments.length > 0) {
      onSubmit(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
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

  const handleImageCapture = async () => {
    try {
      const image = await imageHandler.current.captureFromCamera();
      setAttachments([...attachments, { type: 'image', data: image }]);
    } catch (error) {
      console.error('Failed to capture image:', error);
    }
  };

  const handleFileUpload = async () => {
    try {
      const files = await fileUploader.current.pick({ multiple: true });
      const fileAttachments = files.map((file) => ({ type: 'file', data: file }));
      setAttachments([...attachments, ...fileAttachments]);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className={`ai-input-container ${className}`}>
      {attachments.length > 0 && (
        <div className="ai-input-attachments">
          {attachments.map((attachment, index) => (
            <div key={index} className="ai-input-attachment">
              <span>{attachment.type}</span>
              <button onClick={() => removeAttachment(index)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="ai-input-main">
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

        <div className="ai-input-actions">
          {enableAudio && (
            <button
              onClick={handleAudioRecord}
              disabled={disabled}
              className={`ai-input-btn ${isRecording ? 'recording' : ''}`}
              title="Record audio"
            >
              🎤
            </button>
          )}

          {enableImage && (
            <button
              onClick={handleImageCapture}
              disabled={disabled}
              className="ai-input-btn"
              title="Capture image"
            >
              📷
            </button>
          )}

          {enableFile && (
            <button
              onClick={handleFileUpload}
              disabled={disabled}
              className="ai-input-btn"
              title="Upload file"
            >
              📎
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={disabled || (!message.trim() && attachments.length === 0)}
            className="ai-input-submit"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
