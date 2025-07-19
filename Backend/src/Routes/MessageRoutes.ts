import express from 'express';
import Message from '../models/MessageModel';

const router = express.Router();

// GET /messages?user1=&user2=
router.get('/', async (req, res) => {
  const { user1, user2 } = req.query as { user1?: string; user2?: string };
  if (!user1) {
    return res.status(400).json({ message: 'user1 is required' });
  }
  try {
    let msgs;
    if (user2) {
      msgs = await Message.find({
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      }).sort({ createdAt: 1 });
    } else {
      msgs = await Message.find({
        $or: [
          { senderId: user1 },
          { receiverId: user1 },
        ],
      }).sort({ createdAt: 1 });
    }
    res.json(msgs);
  } catch (err) {
    console.error('Fetch messages error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /messages
router.post('/', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.status(201).json(msg);
  } catch (err) {
    console.error('Save message error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
