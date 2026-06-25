require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const rateLimit = require('express-rate-limit');
const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'عدد محاولات تسجيل الدخول تجاوز الحد المسموح، حاول بعد 15 دقيقة' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', loginLimiter);
app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const attendanceRoutes = require('./routes/attendance');
const honorRoutes = require('./routes/honors');
const occasionRoutes = require('./routes/occasions');
const newsRoutes = require('./routes/news');
const contactRoutes = require('./routes/contact');
const certificateRoutes = require('./routes/certificates');
const settingsRoutes = require('./routes/settings');
const lessonRoutes = require('./routes/lessons');
const databaseRoutes = require('./routes/database');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/honors', honorRoutes);
app.use('/api/occasions', occasionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/database', databaseRoutes);

app.get('/api/developer-contact', async (req, res) => {
  try {
    const https = require('https');
    const data = await new Promise((resolve, reject) => {
      https.get('https://010ahmed010.github.io/api/Amj-contact.json', (response) => {
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
          try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
        });
      }).on('error', reject);
    });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch developer contact' });
  }
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not set. Please add it to your secrets.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

async function seedAdmin() {
  const User = require('./models/User');
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    const admin = new User({
      name: 'المدير',
      username: 'admin',
      email: 'admin@masjidi.com',
      password: process.env.ADMIN_PASSWORD || 'admin',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin account created — username: admin, password:', process.env.ADMIN_PASSWORD || 'admin');
  }
}

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedAdmin();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});
