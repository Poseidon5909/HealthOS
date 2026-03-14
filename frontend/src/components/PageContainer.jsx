import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * PageContainer Component
 * 
 * Purpose:
 * Provides consistent padding, spacing, and max-width for page content.
 * 
 * Why use a container:
 * - Prevents content from stretching too wide on large screens
 * - Consistent spacing on all pages
 * - Easy to adjust layout globally
 * - Responsive padding on mobile
 * 
 * Props:
 * - children: The page content to wrap
 * - maxWidth: Optional custom max-width (default: 7xl)
 * 
 * Usage:
 * <PageContainer>
 *   <h1>My Page Title</h1>
 *   <p>Page content...</p>
 * </PageContainer>
 */
function PageContainer({ children, maxWidth = '7xl' }) {
  const location = useLocation();
  const maxWidthClass = `max-w-${maxWidth}`;
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8`}
    >
      {children}
    </motion.div>
  );
}

export default PageContainer;
