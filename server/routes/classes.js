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
    const data = { ...req.body };
    if (!data.teacher) delete data.teacher;
    const cls = new Class(data);
    await cls.save();
    if (data.teacher) {
      await User.findByIdAndUpdate(data.teacher, { $addToSet: { assignedClasses: cls._id } });
    }
    res.status(201).json(cls);
  } catch (err) { res.status(500).json({ message: err.message }); }
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
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (cls?.teacher) {
      await User.findByIdAndUpdate(cls.teacher, { $pull: { assignedClasses: cls._id } });
    }
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
