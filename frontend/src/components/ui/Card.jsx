import { motion } from 'framer-motion';

function Card({ children, className = '', padded = true, hoverable = false }) {
  return (
    <motion.article
      whileHover={hoverable ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
    >
      {children}
    </motion.article>
  );
}

export default Card;
