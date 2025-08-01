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

// DELETE /messages/:id - delete a single message by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid message ID format' });
    }
    
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    console.log(`Message ${id} deleted successfully`);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete message error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
});

// DELETE /messages?user1=...&user2=... - delete all messages between two users
router.delete('/', async (req, res) => {
  const { user1, user2 } = req.query as { user1?: string; user2?: string };
  if (!user1 || !user2) {
    return res.status(400).json({ message: 'user1 and user2 are required' });
  }
  try {
    const result = await Message.deleteMany({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    });
    res.json({ message: 'Chat cleared', deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Clear chat error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /messages/latest?user1=...
router.get('/latest', async (req, res) => {
  const { user1 } = req.query as { user1?: string };
  if (!user1) {
    return res.status(400).json({ message: 'user1 is required' });
  }
  try {
    // Find all messages involving user1
    const msgs = await Message.find({
      $or: [
        { senderId: user1 },
        { receiverId: user1 },
      ],
    }).sort({ createdAt: -1 });

    // Map to latest message per unique conversation (user1 <-> user2)
    const latestMap = new Map();
    msgs.forEach(msg => {
      // Conversation key: always store as lower id first for uniqueness
      const ids = [msg.senderId, msg.receiverId].sort();
      const key = ids.join('-');
      // Only include conversations where user1 is one of the participants
      if (ids.includes(user1) && !latestMap.has(key)) {
        latestMap.set(key, msg);
      }
    });
    const latestMessages = Array.from(latestMap.values());
    res.json(latestMessages);
  } catch (err) {
    console.error('Fetch latest messages error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
