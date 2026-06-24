const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
