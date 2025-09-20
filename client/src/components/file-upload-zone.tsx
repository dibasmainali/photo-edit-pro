import { useCallback, useState } from "react";
import { Upload, FolderOpen, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  supportedFormats?: string;
  testId?: string;
  isLoading?: boolean;
  multiple?: boolean;
}

export default function FileUploadZone({
  onFileSelect,
  onFilesSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  icon,
  title = "Drop your image here",
  description = "or click to browse files",
  supportedFormats = "Supports: JPEG, PNG, WebP • Max size: 10MB",
  testId = "upload-zone",
  isLoading = false,
  multiple = false,
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
      if (multiple && onFilesSelect) {
        const validFiles = files.filter((f) => !validateFile(f));
        if (validFiles.length) {
          onFilesSelect(validFiles);
        }
      } else {
        handleFileSelect(files[0]);
      }
    }
  }, [handleFileSelect, multiple, onFilesSelect, validateFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple && onFilesSelect) {
        const fileArray = Array.from(files).filter((f) => !validateFile(f));
        if (fileArray.length) {
          onFilesSelect(fileArray);
        }
      } else {
        handleFileSelect(files[0]);
      }
    }
  }, [handleFileSelect, multiple, onFilesSelect, validateFile]);

  const handleClick = () => {
    const input = document.getElementById(`file-input-${testId}`) as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="text-center mb-8">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group ${
          isDragOver
            ? "border-red-500 bg-red-50 transform scale-102"
            : "border-gray-300 hover:border-red-400 hover:bg-red-50"
        } ${error ? "border-red-500 bg-red-50" : ""} ${isLoading ? "pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        data-testid={testId}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-red-500" />
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
          </div>
        )}
        
        <div className="relative z-10">
          {icon || (
            <div className="mx-auto mb-6 h-16 w-16 text-gray-400 group-hover:text-red-500 transition-colors duration-300">
              {isLoading ? (
                <Loader2 className="h-16 w-16 animate-spin" />
              ) : (
                <Upload className="h-16 w-16 group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          )}
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
          
          <Button 
            className="mb-4 bg-red-500 hover:bg-red-600 text-white group-hover:scale-105 transition-transform duration-300" 
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
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {format.trim()}
              </span>
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
          multiple={multiple}
        />
        
        {error && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-red-600 text-sm font-medium" data-testid={`error-${testId}`}>
                {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
