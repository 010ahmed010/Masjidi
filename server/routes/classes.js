const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher', 'name email').populate('students', 'name');
    res.json(classes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cls = new Class(req.body);
    await cls.save();
    if (req.body.teacher) {
      await User.findByIdAndUpdate(req.body.teacher, { $addToSet: { assignedClasses: cls._id } });
    }
    res.status(201).json(cls);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cls);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
