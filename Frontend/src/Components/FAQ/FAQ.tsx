import React, { useState } from "react";
import FAQAccordion from "./FAQAccordion";
import { FiSearch } from "react-icons/fi";
import Navbar from '../../LoginRegister/components/Navbar';

import faqImg from "../../asset/images.png";
import { dividerClasses } from "@mui/material";


const faqData = [
  {
    question: "How do I apply for a degree program?",
    answer: "Browse the available degree programs, click on the program you are interested in, and then click the 'Apply' button. Fill out the application form and submit your details."
  },
  {
    question: "How many jobs or programs can I apply to at the same time?",
    answer: "You can apply to multiple jobs or degree programs simultaneously. There is no limit, but make sure to track your applications from your dashboard."
  },
  {
    question: "How do I create an account on MediConnect?",
    answer: "Click on the 'Register' button on the homepage, select your user type (Medical Student, Physician, Recruiter, or Institute), and fill in the required information to create your account."
  },
  {
    question: "Can I edit my application after submitting?",
    answer: "Yes, you can edit your application before the application deadline by going to your dashboard and selecting the application you wish to update."
  },
  {
    question: "How do I upload my CV or documents?",
    answer: "During the application process, you will be prompted to upload your CV and any required documents. Supported formats include PDF and DOCX."
  },
  {
    question: "How do I contact support?",
    answer: "You can use the feedback form available on the website or email us at support@mediconnect.com."
  },
  {
    question: "Is there a fee to apply for programs?",
    answer: "Application fees depend on the program or institution. Please check the program details for specific fee information."
  },
  {
    question: "How do recruiters post a new job or degree program?",
    answer: "Recruiters and institutions can log in to their dashboard and use the 'Post a Job' or 'Post a Degree' button to create new listings."
  }
];

const FAQ: React.FC = () => {
  const [search, setSearch] = useState("");
  const filteredFaqs = faqData.filter(faq =>
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
          {filteredFaqs.length > 0 ? (
            (search
              ? filteredFaqs
              : filteredFaqs.slice(0, 5)
            ).map((faq, idx) => (
              <FAQAccordion key={idx} question={faq.question} answer={faq.answer} />
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