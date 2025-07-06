import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getFiles, uploadFiles, deleteFile } from '../services/api';
import FileList from '../components/FileList';
import UploadForm from '../components/UploadForm';

function Room() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (code?.length !== 6) {
      toast.error('Invalid room code');
      navigate('/');
      return;
    }
    loadFiles();
  }, [code]);

  const loadFiles = async () => {
    try {
      const filesData = await getFiles(code);
      setFiles(filesData);
    } catch (error) {
      toast.error('Failed to load files');
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (selectedFiles) => {
    try {
      setUploadProgress(0);
      const formData = new FormData();
      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file);
      });

      const uploadedFiles = await uploadFiles(code, formData, (progress) => {
        setUploadProgress(progress);
      });

      setFiles(prev => [...prev, ...uploadedFiles]);
      toast.success('Files uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload files');
      console.error('Error uploading files:', error);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(code, fileId);
      setFiles(prev => prev.filter(file => file._id !== fileId));
      toast.success('File deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Error deleting file:', error);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Room code copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Room: {code}</h1>
            <p className="text-gray-600">Share this code with others to give them access</p>
          </div>
          <button
            onClick={copyRoomCode}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
          >
            Copy Code
          </button>
        </div>

        <UploadForm onUpload={handleUpload} progress={uploadProgress} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shared Files</h2>
          <FileList files={files} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default Room;