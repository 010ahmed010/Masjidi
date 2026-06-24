const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

router.get('/public', async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate('class', 'name')
      .populate('teacher', 'name')
      .sort({ updatedAt: -1 });
    res.json(lessons);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { classId } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (req.user.role === 'teacher') filter.teacher = req.user.id;
    const lessons = await Lesson.find(filter)
      .populate('class', 'name')
      .populate('teacher', 'name')
      .sort({ updatedAt: -1 });
    res.json(lessons);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.post('/', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { classId, days } = req.body;
    const lesson = await Lesson.findOneAndUpdate(
      { class: classId, teacher: req.user.id },
      { days },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(lesson);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
