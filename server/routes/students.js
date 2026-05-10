const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authMiddleware, adminOnly, teacherOnly } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { classId, teacherId, name, status } = req.query;
    const filter = {};
    if (classId) filter.assignedClass = classId;
    if (teacherId) filter.assignedTeacher = teacherId;
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (status) filter.status = status;
    if (req.user.role === 'teacher') filter.assignedTeacher = req.user.id;
    const students = await Student.find(filter).populate('assignedClass assignedTeacher', 'name');
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
