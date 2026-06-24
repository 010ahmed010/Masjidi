const express = require('express');
const router = express.Router();
const Occasion = require('../models/Occasion');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const occasions = await Occasion.find().sort({ createdAt: -1 });
    res.json(occasions);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, image, active } = req.body;
    const occasion = new Occasion({ title, description, image, active });
    await occasion.save();
    res.status(201).json(occasion);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, image, active } = req.body;
    const occasion = await Occasion.findByIdAndUpdate(
      req.params.id,
      { title, description, image, active },
      { new: true }
    );
    res.json(occasion);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Occasion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
