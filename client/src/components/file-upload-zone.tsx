import { useCallback, useState } from "react";
import { Upload, FolderOpen, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { filterValidFiles } from "@/lib/image-utils";

// File signatures (magic bytes) for validation
const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header, need to check WEBP at offset 8
  'image/gif': [[0x47, 0x49, 0x46, 0x38], [0x47, 0x49, 0x46, 0x39]], // GIF87a, GIF89a
  'image/bmp': [[0x42, 0x4D]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

async function validateFileSignature(file: File, expectedMime: string): Promise<boolean> {
  const signatures = FILE_SIGNATURES[expectedMime];
  if (!signatures) return true; // Unknown type, skip signature check
  
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    for (const sig of signatures) {
      if (expectedMime === 'image/webp') {
        // WebP: RIFF....WEBP
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
          return true;
        }
      } else {
        let match = true;
        for (let i = 0; i < sig.length; i++) {
          if (bytes[i] !== sig[i]) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
    }
    return false;
  } catch {
    return false; // If we can't read, reject
  }
}

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
  compact?: boolean;
  onRemove?: () => void;
  selectedFile?: File | null;
}

export default function FileUploadZone({
  onFileSelect,
  onFilesSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024,
  icon,
  title = "Drop your image here",
  description = "or click to browse files",
  supportedFormats = "Supports: JPEG, PNG, WebP • Max size: 10MB",
  testId = "upload-zone",
  isLoading = false,
  multiple = false,
  compact = false,
  onRemove,
  selectedFile,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const validateFile = useCallback(async (file: File): Promise<string | null> => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    const acceptsPdf = accept.includes('application/pdf');
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    if (!isImage && !(acceptsPdf && isPdf)) {
      return 'Unsupported file type for this uploader';
    }

    // Validate file signature (magic bytes)
    const validSignature = await validateFileSignature(file, file.type);
    if (!validSignature) {
      return 'Invalid file format. File content does not match its extension.';
    }

    return null;
  }, [maxSize, accept]);

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = await validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple && onFilesSelect) {
        const validFiles = filterValidFiles(files, accept, maxSize);
        if (validFiles.length) {
          onFilesSelect(validFiles);
        } else {
          setError('No valid files were selected. Please choose supported image files.');
        }
      } else {
        await handleFileSelect(files[0]);
      }
    }
  }, [handleFileSelect, multiple, onFilesSelect, validateFile]);

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple && onFilesSelect) {
        const validFiles = filterValidFiles(Array.from(files), accept, maxSize);
        if (validFiles.length) {
          onFilesSelect(validFiles);
        } else {
          setError('No valid files were selected. Please choose supported image files.');
        }
      } else {
        await handleFileSelect(files[0]);
      }
    }
    e.target.value = '';
  }, [handleFileSelect, multiple, onFilesSelect, validateFile]);

  const handleClick = () => {
    if (!isLoading) {
      const input = document.getElementById(`file-input-${testId}`) as HTMLInputElement;
      input?.click();
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (selectedFile && !isLoading) {
    return (
      <div className="upload-zone p-4" data-testid={testId}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <Upload className="w-6 h-6 text-red-500" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            onClick={handleRemoveClick}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
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
      </div>
    );
  }

  return (
    <div className="w-full" data-testid={testId}>
      <div
        className={`upload-zone ${compact ? 'p-4 sm:p-8 md:p-12' : 'p-8 md:p-12'} text-center transition-all duration-200 ${
          isDragOver ? 'drag-over' : ''
        } ${error ? 'error' : ''} ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
        aria-label={title}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-xl">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-red-500" aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing...</p>
            </div>
          </div>
        )}

        <div className={`relative z-10 ${compact ? 'space-y-3 sm:space-y-4' : 'space-y-4'}`}>
          <div className={`mx-auto ${compact ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-16 h-16'} rounded-xl bg-red-50 flex items-center justify-center transition-transform duration-300`}>
            {icon || (
              <>
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" aria-hidden="true" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" aria-hidden="true" />
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <h3 className={`${compact ? 'text-base sm:text-lg' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>{title}</h3>
            <p className={`${compact ? 'text-sm sm:text-base' : ''} text-gray-500 dark:text-gray-400`}>{description}</p>
          </div>

          <Button
            className={`${compact ? 'h-9 px-4 text-sm sm:h-11 sm:px-8 sm:text-base' : ''} bg-red-500 hover:bg-red-600 text-white transition-colors`}
            data-testid={`button-browse-${testId}`}
            disabled={isLoading}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(); }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Processing...
              </>
            ) : (
              <>
                <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                Select Files
              </>
            )}
          </Button>

          <div className={`flex flex-wrap justify-center ${compact ? 'gap-1.5 sm:gap-2' : 'gap-2'} text-xs`}>
            {supportedFormats.split('•').map((format, index) => (
              <span key={index} className={`${compact ? 'px-1.5 py-1 sm:px-2' : 'px-2'} rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`}>
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
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 animate-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span data-testid={`error-${testId}`}>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}