import  { useState, useEffect } from "react";
import FAQAccordion from "./FAQAccordion";
import { FiSearch } from "react-icons/fi";
import Navbar from '../../LoginRegister/components/Navbar';
import faqImg from "../../asset/images.png";

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<{ question: string; answer: string; _id?: string }[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/faqs")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        return res.json();
      })
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not load FAQs. Please try again later.");
        setLoading(false);
      });
  }, []);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-white px-4 md:px-12 py-8 pt-16">
        {/* Left: FAQ Content */}
        <div className="w-full md:w-1/2 px-8 md:px-16 flex flex-col">
          <div className="sticky top-0 z-10 bg-white pb-2">
            <h1 className="font-extrabold mb-8 text-left" style={{ fontSize: '70px' }}>Frequently Asked Questions</h1>
          </div>
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search question here"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-3 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
          <div>
            {loading ? (
              <div className="text-gray-400">Loading FAQs...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : filteredFaqs.length > 0 ? (
              (search
                ? filteredFaqs
                : filteredFaqs.slice(0, 5)
              ).map((faq, idx) => (
                <FAQAccordion key={faq._id || idx} question={faq.question} answer={faq.answer} />
              ))
            ) : (
              <div className="text-gray-400">No FAQs found.</div>
            )}
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 pl-8 items-center justify-center h-full">
          <img src={faqImg} alt="FAQ Illustration" className="w-full max-w-3xl rounded-2xl object-contain" />
        </div>
      </div>
    </div>
  );
};

export default FAQ; 