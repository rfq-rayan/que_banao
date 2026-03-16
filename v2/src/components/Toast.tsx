import { useEffect } from "react";

/**
 * Toast – Auto-dismissing notification that appears at bottom-right.
 * Disappears after 3.5 seconds.
 */
export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm z-[9999] animate-slide-up">
      {message}
    </div>
  );
}
