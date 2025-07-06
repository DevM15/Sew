import { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

function UploadForm({ onUpload, progress }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );

    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );

    if (files.length > 0) {
      onUpload(files);
    }
    // Reset file input
    e.target.value = null;
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf"
        multiple
        className="hidden"
      />

      <div className="space-y-4">
        <div className="flex justify-center">
          <FiUploadCloud className="w-12 h-12 text-gray-400" />
        </div>
        
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Click to upload
          </button>
          <span className="text-gray-500"> or drag and drop</span>
        </div>
        
        <p className="text-sm text-gray-500">
          PDF files only (max 10MB per file)
        </p>

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadForm;