import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

const ServerErrorPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <HiOutlineExclamationTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-8xl font-bold text-gray-800">500</h1>
        <p className="mt-4 text-xl font-medium text-gray-600">
          Server error
        </p>
        <p className="mt-2 text-gray-400">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerErrorPage;
