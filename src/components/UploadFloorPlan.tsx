import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface UploadFloorPlanProps {
  onUpload: (file: File) => void;
}

export const UploadFloorPlan: React.FC<UploadFloorPlanProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full h-64 border-2 border-dashed rounded-lg
        flex flex-col items-center justify-center p-8
        cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
      <p className="text-lg font-medium text-center">
        {isDragActive ? (
          'Drop the floor plan here'
        ) : (
          'Drag & drop a floor plan, or click to select'
        )}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Supports JPEG, PNG, GIF, and PDF files
      </p>
    </div>
  );
};