const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const certs = await Certificate.find().populate('student', 'name').sort({ issuedAt: -1 });
    res.json(certs);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { student, title, description, issuedAt, status, notes } = req.body;
    const cert = new Certificate({ student, title, description, issuedAt, status, notes });
    await cert.save();
    res.status(201).json(cert);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { student, title, description, issuedAt, status, notes } = req.body;
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { student, title, description, issuedAt, status, notes },
      { new: true }
    );
    res.json(cert);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
