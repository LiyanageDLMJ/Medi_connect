import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL = "http://localhost:3000/api/faqs";

const FAQAdd: React.FC = () => {
  const [faqs, setFaqs] = useState<{question: string, answer: string, _id?: string}[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // Fetch FAQs from backend
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setFaqs(data));
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer })
    });
    if (res.ok) {
      const newFaq = await res.json();
      setFaqs([newFaq, ...faqs]);
      setQuestion("");
      setAnswer("");
    }
    setLoading(false);
  };

  const handleDeleteFaq = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFaqs(faqs.filter(faq => faq._id !== id));
    }
  };

  const startEdit = (faq: {question: string, answer: string, _id?: string}) => {
    setEditId(faq._id || null);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleEditFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: editQuestion, answer: editAnswer })
    });
    if (res.ok) {
      const updatedFaq = await res.json();
      setFaqs(faqs.map(faq => faq._id === editId ? updatedFaq : faq));
      setEditId(null);
      setEditQuestion("");
      setEditAnswer("");
    }
  };

  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex-1 overflow-auto ">
        <Topbar />
        <div className="max-w-6xl mx-auto py-2 px-1">
          <h2 className="text-3xl font-bold mb-4">Add FAQ</h2>
          <form onSubmit={handleAddFaq} className="mb-8 bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label className="block font-semibold mb-1">Question</label>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter question"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Answer</label>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter answer"
                required
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? "Adding..." : "Add FAQ"}
            </button>
          </form>
          <h3 className="text-xl font-semibold mb-4">Existing FAQs</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq._id || idx} className="bg-gray-100 p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                {editId === faq._id ? (
                  <form onSubmit={handleEditFaq} className="flex-1 flex flex-col md:flex-row gap-2 items-start md:items-center">
                    <input
                      type="text"
                      value={editQuestion}
                      onChange={e => setEditQuestion(e.target.value)}
                      className="border rounded px-2 py-1 w-full md:w-1/3"
                      required
                    />
                    <textarea
                      value={editAnswer}
                      onChange={e => setEditAnswer(e.target.value)}
                      className="border rounded px-2 py-1 w-full md:w-1/2"
                      required
                    />
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <div>
                      <div className="font-semibold">Q: {faq.question}</div>
                      <div className="text-gray-700 mt-1">A: {faq.answer}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => startEdit(faq)}>Edit</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDeleteFaq(faq._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQAdd; 