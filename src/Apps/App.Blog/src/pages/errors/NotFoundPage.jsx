import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch } from 'react-icons/hi';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <HiOutlineSearch className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-8xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl font-medium text-gray-600">
          Page not found
        </p>
        <p className="mt-2 text-gray-400">
          The page you are looking for doesn&#39;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
