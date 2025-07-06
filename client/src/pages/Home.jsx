import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createRoom } from '../services/api';

function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      const { code } = await createRoom();
      toast.success('Room created successfully!');
      navigate(`/room/${code}`);
    } catch (error) {
      toast.error('Failed to create room');
      console.error('Error creating room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.length !== 6) {
      toast.error('Room code must be 6 characters');
      return;
    }
    navigate(`/room/${roomCode.toUpperCase()}`);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to SEW</h1>
        <p className="text-lg text-gray-600">Share PDFs instantly with anyone using room codes</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create New Room'}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
              Join Existing Room
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit room code"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-200"
          >
            Join Room
          </button>
        </form>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>No registration required. Just create or join a room to start sharing PDFs.</p>
      </div>
    </div>
  );
}

export default Home;