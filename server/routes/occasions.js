const express = require('express');
const router = express.Router();
const Occasion = require('../models/Occasion');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const occasions = await Occasion.find().sort({ createdAt: -1 });
    res.json(occasions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const occasion = new Occasion(req.body);
    await occasion.save();
    res.status(201).json(occasion);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const occasion = await Occasion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(occasion);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Occasion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
