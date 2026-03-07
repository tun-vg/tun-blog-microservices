import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed } from 'react-icons/hi2';

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
          <HiOutlineLockClosed className="h-10 w-10 text-violet-500" />
        </div>
        <h1 className="text-8xl font-bold text-gray-800">403</h1>
        <p className="mt-4 text-xl font-medium text-gray-600">
          Access denied
        </p>
        <p className="mt-2 text-gray-400">
          You don&#39;t have permission to access this page.
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

export default UnauthorizedPage;
