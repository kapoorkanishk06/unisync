import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export function DropZone({ onFilesDrop, disabled = false, className }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf" || 
                file.type === "image/png" || 
                file.type === "image/jpeg" ||
                file.type === "image/webp"
    );

    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
      onFilesDrop(droppedFiles);
    }
  }, [disabled, onFilesDrop]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      onFilesDrop(selectedFiles);
    }
  }, [onFilesDrop]);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
          isDragging ? "border-brand-1 bg-brand-1/5" : "border-border hover:border-brand-1/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
          className="space-y-3"
        >
          <Upload className="h-12 w-12 mx-auto text-text-dim" />
          <div>
            <p className="font-semibold text-text">
              Drop your chaos here
            </p>
            <p className="text-sm text-text-dim mt-1">
              PDFs, screenshots, notices, lab manuals
            </p>
          </div>
          <p className="text-xs text-text-mute">
            Max 10 files · 10 MB each
          </p>
        </motion.div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2"
            >
              <File className="h-4 w-4 text-text-dim" />
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <span className="text-xs text-text-dim">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-surface-3 rounded transition-colors"
              >
                <X className="h-4 w-4 text-text-dim" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
