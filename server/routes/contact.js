const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        whatsapp: '+966500000000',
        phone: '+966500000000',
        email: 'info@masjidi.com',
        description: 'مسجدي - معهد متخصص في تعليم القرآن الكريم والعلوم الإسلامية',
        address: 'المملكة العربية السعودية'
      });
      await contact.save();
    }
    res.json(contact);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

router.put('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact(req.body);
    } else {
      Object.assign(contact, req.body);
    }
    await contact.save();
    res.json(contact);
  } catch (err) { res.status(500).json({ message: 'حدث خطأ في الخادم' }); }
});

module.exports = router;
