import express from 'express';
import User from '../../models/UserModel'

const router = express.Router();

// GET /users?search=&userType=
router.get('/', async (req, res) => {
  try {
    const { search = '', userType } = req.query as { search?: string; userType?: string };
    const criteria: any = {};
    if (userType) {
      criteria.userType = userType;
    }
    if (search) {
      criteria.name = { $regex: search as string, $options: 'i' };
    }
    const users = await User.find(criteria, { _id: 1, name: 1, userType: 1, email: 1 }).lean();
    res.json(users);
  } catch (err) {
    console.error('User list error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
