import { useCallback, useState } from "react";
import { Upload, FolderOpen, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  supportedFormats?: string;
  testId?: string;
  isLoading?: boolean;
}

export default function FileUploadZone({
  onFileSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  icon,
  title = "Drop your image here",
  description = "or click to browse files",
  supportedFormats = "Supports: JPEG, PNG, WebP • Max size: 10MB",
  testId = "upload-zone",
  isLoading = false,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file';
    }

    return null;
  }, [maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = () => {
    const input = document.getElementById(`file-input-${testId}`) as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="text-center mb-8">
      <div
        className={`drag-zone border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group ${
          isDragOver
            ? "drag-over border-accent bg-accent/10 transform scale-102"
            : "border-border hover:border-primary hover:bg-primary/5"
        } ${error ? "border-destructive bg-destructive/5" : ""} ${isLoading ? "pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        data-testid={testId}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing...</p>
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          {icon || (
            <div className="mx-auto mb-6 h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors duration-300">
              {isLoading ? (
                <Loader2 className="h-16 w-16 animate-spin" />
              ) : (
                <Upload className="h-16 w-16 group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          )}
          
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 group-hover:text-foreground/90 transition-colors duration-300">
            {description}
          </p>
          
          <Button 
            className="mb-4 group-hover:scale-105 transition-transform duration-300" 
            data-testid={`button-browse-${testId}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FolderOpen className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Processing..." : "Select Files"}
          </Button>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {supportedFormats.split('•').map((format, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {format.trim()}
              </Badge>
            ))}
          </div>
        </div>
        
        <input
          id={`file-input-${testId}`}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          data-testid={`input-file-${testId}`}
          disabled={isLoading}
        />
        
        {error && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-destructive text-sm font-medium" data-testid={`error-${testId}`}>
                {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
