const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Attendance = require('../models/Attendance');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'masjidi_secret_key_2024';

router.get('/', async (req, res) => {
  try {
    const { classId, date } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
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

router.get('/today-summary', async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    let records = await Attendance.find({ date: { $gte: start, $lt: end } });
    let isToday = true;
    let summaryDate = start;

    if (records.length === 0) {
      const latest = await Attendance.findOne({ date: { $lt: start } }).sort({ date: -1 });
      if (latest) {
        const lastDate = new Date(latest.date);
        const lastStart = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const lastEnd = new Date(lastStart);
        lastEnd.setDate(lastStart.getDate() + 1);
        records = await Attendance.find({ date: { $gte: lastStart, $lt: lastEnd } });
        summaryDate = lastStart;
        isToday = false;
      }
    }

    let present = 0, absent = 0, excused = 0;
    records.forEach(att => {
      att.records.forEach(r => {
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'excused') excused++;
      });
    });

    res.json({ date: summaryDate, present, absent, excused, hasData: records.length > 0, isToday });
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
