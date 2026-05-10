const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password').populate('assignedClasses', 'name');
    res.json(teachers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const teacher = new User({ ...req.body, role: 'teacher' });
    await teacher.save();
    const t = teacher.toObject();
    delete t.password;
    res.status(201).json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      const bcrypt = require('bcryptjs');
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }
    const teacher = await User.findByIdAndUpdate(req.params.id, data, { new: true }).select('-password');
    res.json(teacher);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
