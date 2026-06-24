const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Class = require('../models/Class');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { classId, teacherId, name, status } = req.query;
    const filter = {};
    if (classId) {
      filter.assignedClass = classId;
    } else if (req.user.role === 'teacher') {
      filter.assignedTeacher = req.user.id;
    }
    if (teacherId) filter.assignedTeacher = teacherId;
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (status) filter.status = status;
    const students = await Student.find(filter).populate('assignedClass assignedTeacher', 'name');
    res.json(students);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (req.body.assignedClass) {
      const cls = await Class.findById(req.body.assignedClass);
      if (cls?.teacher) req.body.assignedTeacher = cls.teacher;
    }
    const student = new Student(req.body);
    await student.save();
    if (req.body.assignedClass) {
      await Class.findByIdAndUpdate(req.body.assignedClass, { $addToSet: { students: student._id } });
    }
    res.status(201).json(student);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const oldStudent = await Student.findById(req.params.id);
    const oldClassId = oldStudent?.assignedClass?.toString();
    const newClassId = req.body.assignedClass?.toString();

    if (req.body.assignedClass) {
      const cls = await Class.findById(req.body.assignedClass);
      if (cls?.teacher) req.body.assignedTeacher = cls.teacher;
    }

    const { name, age, phone, whatsapp, guardianName, guardianPhone, assignedClass, status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, phone, whatsapp, guardianName, guardianPhone, assignedClass, assignedTeacher: req.body.assignedTeacher, status },
      { new: true }
    );

    if (oldClassId && oldClassId !== newClassId) {
      await Class.findByIdAndUpdate(oldClassId, { $pull: { students: student._id } });
    }
    if (newClassId) {
      await Class.findByIdAndUpdate(newClassId, { $addToSet: { students: student._id } });
    }

    res.json(student);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student?.assignedClass) {
      await Class.findByIdAndUpdate(student.assignedClass, { $pull: { students: student._id } });
    }
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
