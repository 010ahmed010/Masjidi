require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());
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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/masjidy';
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, 'localhost', () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message));
