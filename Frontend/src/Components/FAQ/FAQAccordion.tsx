import  { useState } from "react";

interface FAQAccordionProps {
  question: string;
  answer: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2 border-b">
      <button
        className="w-full text-left font-bold text-lg md:text-xl py-3 flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {question}
        <span className="text-2xl">{open ? "-" : "+"}</span>
      </button>
      {open && <div className="text-gray-600 pb-3 pl-2 text-base md:text-lg leading-relaxed">{answer}</div>}
    </div>
  );
};

export default FAQAccordion; 