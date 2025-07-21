import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal";

const FloatingFeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Give Feedback"
      >
        <span role="img" aria-label="feedback">💬</span>
      </button>
      {/* Feedback Modal */}
      <FeedbackModal
        open={open}
        onClose={() => setOpen(false)}
        title="Feedback Us"
        placeholder="Type Here... (Share your experience in detail)"
      />
    </>
  );
};

export default FloatingFeedbackButton; 