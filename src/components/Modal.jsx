// A pop-up window over a dark background, with a pop-in animation.
import { motion } from 'framer-motion';
import './Modal.css';

export default function Modal({ children, wide = false, label }) {
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className={`modal ${wide ? 'modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
