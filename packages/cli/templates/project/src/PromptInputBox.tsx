import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, FolderCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// Embedded CSS for minimal custom styles
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #444444;
    border-radius: 3px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: #555555;
  }
`;

// Inject styles into document
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('prompt-input-box-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'prompt-input-box-styles';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn("ai-input-field", className)}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "icon";
  size?: "default" | "sm" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass = variant === "ghost" ? "ai-input-btn" : variant === "icon" ? "ai-input-btn" : "ai-input-submit";
    return (
      <button
        ref={ref}
        className={cn(variantClass, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Tooltip Component
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Component
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-800 bg-gray-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Image View Dialog Component
interface ImageViewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageViewDialog: React.FC<ImageViewDialogProps> = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={!!imageUrl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-full h-auto rounded-md" />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Main PromptInputBox Component
interface PromptInputBoxProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string, files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
  ({ input, setInput, onSend, placeholder = "Type your message...", disabled = false }, ref) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [filePreviews, setFilePreviews] = React.useState<{ [key: string]: string }>({});
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [showThink, setShowThink] = React.useState(false);
    const [showCanvas, setShowCanvas] = React.useState(false);
    const uploadInputRef = React.useRef<HTMLInputElement>(null);
    const promptBoxRef = React.useRef<HTMLTextAreaElement>(null);

    const handleToggleChange = (value: string) => {
      if (value === "search") {
        setShowSearch((prev) => !prev);
        setShowThink(false);
      } else if (value === "think") {
        setShowThink((prev) => !prev);
        setShowSearch(false);
      }
    };

    const handleCanvasToggle = () => setShowCanvas((prev) => !prev);

    const isImageFile = (file: File) => file.type.startsWith("image/");

    const processFile = (file: File) => {
      if (!isImageFile(file)) {
        console.log("Only image files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        console.log("File too large (max 10MB)");
        return;
      }
      setFiles([file]);
      const reader = new FileReader();
      reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
      reader.readAsDataURL(file);
    };

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFiles = Array.from(e.dataTransfer.files);
      const imageFiles = droppedFiles.filter((file) => isImageFile(file));
      if (imageFiles.length > 0) processFile(imageFiles[0]);
    }, []);

    const handleRemoveFile = (index: number) => {
      const fileToRemove = files[index];
      if (fileToRemove && filePreviews[fileToRemove.name]) setFilePreviews({});
      setFiles([]);
    };

    const openImageModal = (imageUrl: string) => setSelectedImage(imageUrl);

    const handlePaste = React.useCallback((e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
            break;
          }
        }
      }
    }, []);

    React.useEffect(() => {
      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }, [handlePaste]);

    const handleSubmit = () => {
      if (input.trim() || files.length > 0) {
        let messagePrefix = "";
        if (showSearch) messagePrefix = "[Search: ";
        else if (showThink) messagePrefix = "[Think: ";
        else if (showCanvas) messagePrefix = "[Canvas: ";
        const formattedInput = messagePrefix ? `${messagePrefix}${input}]` : input;
        onSend(formattedInput, files);
        setInput("");
        setFiles([]);
        setFilePreviews({});
      }
    };

    const handleStartRecording = () => {
      console.log("Started recording");
      setIsRecording(true);
    };

    const handleStopRecording = (duration: number) => {
      console.log(`Stopped recording after ${duration} seconds`);
      setIsRecording(false);
      onSend(`[Voice message - ${duration} seconds]`, []);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const hasContent = input.trim() !== "" || files.length > 0;

    return (
      <TooltipPrimitive.Provider>
        <div
          ref={ref}
          className="ai-pane-input"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="ai-input-container">
            {/* File Previews */}
            {files.length > 0 && (
              <div className="ai-input-attachments">
                <AnimatePresence>
                  {files.map((file, index) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="ai-input-attachment"
                    >
                      {filePreviews[file.name] && (
                        <img
                          src={filePreviews[file.name]}
                          alt={file.name}
                          className="w-8 h-8 rounded cursor-pointer object-cover"
                          onClick={() => openImageModal(filePreviews[file.name])}
                        />
                      )}
                      <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Main Input Area */}
            <div className="ai-input-main" style={{ display: 'flex' }}>
              <Textarea
                ref={promptBoxRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                style={{ flex: 1, resize: 'none' }}
              />

              {/* Actions */}
              <div className="ai-input-actions" style={{ display: 'flex' }}>
                {/* Upload Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={() => uploadInputRef.current?.click()}
                      disabled={disabled}
                      type="button"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach Image</TooltipContent>
                </Tooltip>

                {/* Toggle Features */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={() => handleToggleChange("search")}
                      disabled={disabled}
                      type="button"
                      style={{ background: showSearch ? 'rgba(97, 217, 255, 0.2)' : undefined }}
                    >
                      <Globe className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Search Mode</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={() => handleToggleChange("think")}
                      disabled={disabled}
                      type="button"
                      style={{ background: showThink ? 'rgba(97, 217, 255, 0.2)' : undefined }}
                    >
                      <BrainCog className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Think Mode</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={handleCanvasToggle}
                      disabled={disabled}
                      type="button"
                      style={{ background: showCanvas ? 'rgba(97, 217, 255, 0.2)' : undefined }}
                    >
                      <FolderCode className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Canvas Mode</TooltipContent>
                </Tooltip>

                {/* Voice Recording */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={isRecording ? () => handleStopRecording(0) : handleStartRecording}
                      disabled={disabled}
                      type="button"
                    >
                      {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isRecording ? "Stop Recording" : "Start Recording"}</TooltipContent>
                </Tooltip>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!hasContent || disabled}
                  type="button"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
        </div>

        <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      </TooltipPrimitive.Provider>
    );
  }
);

PromptInputBox.displayName = "PromptInputBox";
