const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { classId, date, studentId } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
    if (req.user.role === 'teacher') filter.teacher = req.user.id;
    const records = await Attendance.find(filter)
      .populate('class', 'name')
      .populate('teacher', 'name')
      .populate('records.student', 'name')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/latest', async (req, res) => {
  try {
    const latest = await Attendance.findOne()
      .populate('class', 'name')
      .populate('records.student', 'name')
      .sort({ date: -1 });
    res.json(latest);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { classId, date, records } = req.body;
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    let att = await Attendance.findOne({ class: classId, date: { $gte: d, $lt: next }, teacher: req.user.id });
    if (att) {
      att.records = records;
      await att.save();
    } else {
      att = new Attendance({ class: classId, teacher: req.user.id, date: d, records });
      await att.save();
    }
    res.json(att);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
