const express = require('express');
const router = express.Router();
const Honor = require('../models/Honor');
const { authMiddleware, adminOnly, teacherOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const honors = await Honor.find(filter)
      .populate('student', 'name age')
      .populate('teacher', 'name')
      .populate('class', 'name')
      .sort({ createdAt: -1 });
    res.json(honors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const honor = new Honor({ ...req.body, teacher: req.user.id });
    await honor.save();
    res.status(201).json(honor);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const honor = await Honor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(honor);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Honor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
