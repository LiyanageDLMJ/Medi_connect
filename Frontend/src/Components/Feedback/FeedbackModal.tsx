import  { useState } from "react";
import { useNavigate } from "react-router-dom";

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  placeholder?: string;
  source?: 'degree_application' | 'course_posting' | 'general';
  sourceDetails?: string;
  degreeId?: string;
  institutionId?: string;
  redirectTo?: string; // New prop for redirection
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  open, 
  onClose, 
  title, 
  placeholder,
  source = 'general',
  sourceDetails,
  degreeId,
  institutionId,
  redirectTo
}) => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      // Prepare headers with JWT token
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Prepare feedback data
      const feedbackData = {
        rating: stars,
        heading: heading,
        feedback: feedback,
        source: source,
        sourceDetails: sourceDetails,
        degreeId: degreeId,
        institutionId: institutionId,
        // Add user details as fallback
        userType: localStorage.getItem('userType') || undefined,
        userName: localStorage.getItem('userName') || undefined,
        userEmail: localStorage.getItem('userEmail') || undefined
      };

      console.log('=== DEBUG: Feedback Submission ===');
      console.log('Feedback data:', feedbackData);
      console.log('Token present:', !!token);

      // Submit feedback to backend
      const response = await fetch('http://localhost:3000/feedback/submit', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(feedbackData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit feedback');
      }

      console.log('Feedback submitted successfully:', result);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback("");
        setHeading("");
        setStars(0);
        setError("");
        onClose();
        
        // Redirect if redirectTo is provided
        if (redirectTo) {
          navigate(redirectTo);
        }
      }, 1500);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg min-h-[480px] relative flex flex-col items-center border border-gray-100">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-1 text-gray-900">{title || "Feedback Us"}</h2>
        <p className="text-gray-400 text-sm mb-4">We value your feedback and use it to improve our service.</p>
        
        {error && (
          <div className="text-red-600 text-center font-medium py-2 mb-4 bg-red-50 rounded-lg px-4">
            {error}
          </div>
        )}
        
        {submitted ? (
          <div className="text-green-600 text-center font-medium py-8">Thank you for your feedback!</div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            {/* Star Rating */}
            <div className="flex mb-4">
              {[1,2,3,4,5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="focus:outline-none"
                  onClick={() => setStars(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <svg
                    className={`w-8 h-8 mx-0.5 ${star <= (hoveredStar || stars) ? 'text-blue-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                </button>
              ))}
            </div>
            {/* Feedback Heading Input */}
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              placeholder="Summary of your feedback"
              value={heading}
              onChange={e => setHeading(e.target.value)}
              required
            />
            {/* Experience Textarea */}
            <label className="block w-full text-gray-700 font-medium mb-1 text-left">Write Your Experiences</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-4 mb-6 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-base"
              placeholder={placeholder || "Type Here... (Share your experience in detail)"}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={stars === 0 || feedback.trim() === "" || heading.trim() === "" || loading}
            >
              {loading ? "Submitting..." : "Submit Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal; 