import { Link } from 'react-router-dom';
import { FiShare2 } from 'react-icons/fi';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FiShare2 className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SEW</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Create New Room
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;