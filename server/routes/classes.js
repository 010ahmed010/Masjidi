const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const Student = require('../models/Student');
const Lesson = require('../models/Lesson');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { teacherId } = req.query;
    const filter = {};
    if (teacherId) filter.teacher = teacherId;
    const classes = await Class.find(filter).populate('teacher', 'name email');
    const result = await Promise.all(classes.map(async (cls) => {
      const students = await Student.find({ assignedClass: cls._id }, 'name _id');
      const obj = cls.toObject();
      obj.students = students;
      return obj;
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.teacher) delete data.teacher;
    const cls = new Class(data);
    await cls.save();
    if (data.teacher) {
      await User.findByIdAndUpdate(data.teacher, { $addToSet: { assignedClasses: cls._id } });
    }
    res.status(201).json(cls);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.teacher) delete data.teacher;

    const oldCls = await Class.findById(req.params.id);
    const oldTeacherId = oldCls?.teacher?.toString();
    const newTeacherId = data.teacher?.toString();

    const cls = await Class.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });

    if (oldTeacherId && oldTeacherId !== newTeacherId) {
      await User.findByIdAndUpdate(oldTeacherId, { $pull: { assignedClasses: cls._id } });
    }
    if (newTeacherId && newTeacherId !== oldTeacherId) {
      await User.findByIdAndUpdate(newTeacherId, { $addToSet: { assignedClasses: cls._id } });
    }

    res.json(cls);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (cls?.teacher) {
      await User.findByIdAndUpdate(cls.teacher, { $pull: { assignedClasses: cls._id } });
    }
    await Lesson.deleteMany({ class: req.params.id });
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
