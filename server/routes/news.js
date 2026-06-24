const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const news = await News.find({ published: true }).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.get('/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, content, type, published } = req.body;
    const news = new News({ title, content, type, published });
    await news.save();
    res.status(201).json(news);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, content, type, published } = req.body;
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, content, type, published },
      { new: true }
    );
    res.json(news);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
