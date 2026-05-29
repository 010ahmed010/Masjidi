const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'masjidi_secret_key_2024';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'غير مصرح' });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'يرجى تعبئة جميع الحقول' });
    if (newPassword.length < 4) return res.status(400).json({ message: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/seed-admin', async (req, res) => {
  try {
    let existing = await User.findOne({ username: 'admin' });
    if (existing) {
      return res.json({ message: 'Admin already exists', username: 'admin', password: 'admin123' });
    }
    const admin = new User({
      name: 'المدير',
      username: 'admin',
      email: 'admin@masjidi.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    res.json({ message: 'Admin created', username: 'admin', password: 'admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
