import React, { useState } from 'react';
import { FaPaperclip, FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './MessageBox.css';

type Props = {
  onSend: (text: string, file?: { url: string; type: string }) => void;
};

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);

  const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/chat/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      onSend('', { url: data.fileUrl, type: file.type });
    } catch (err) {
      console.error(err);
      toast.error('File upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/chat/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      onSend('', { url: data.fileUrl, type: file.type });
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleVoiceRecord = () => {
    // Voice recording functionality would be implemented here
    toast('Voice recording feature coming soon!');
  };

  return (
    <>
      <div className="message-input">
        <label className="file-btn" title="Attach file" aria-label="Attach file">
          <FaPaperclip />
          <input type="file" accept="application/pdf,.doc,.docx,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        
        <label className="file-btn" title="Add media" aria-label="Add media">
          <FaImage />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>
        
        <button className="file-btn" title="Record voice message" onClick={handleVoiceRecord}>
          <FaMicrophone />
        </button>
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={uploading}
        />
        
        <button onClick={handleSend} disabled={uploading || !text.trim()}>
          <FaPaperPlane />
        </button>
      </div>
    </>
  );
};

export default MessageInput;
