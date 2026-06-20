const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const dbStats = await db.stats({ scale: 1 });

    const collectionNames = await db.listCollections().toArray();
    const collections = await Promise.all(
      collectionNames.map(async (col) => {
        try {
          const stats = await db.collection(col.name).stats({ scale: 1 });
          return {
            name: col.name,
            count: stats.count || 0,
            dataSize: stats.size || 0,
            storageSize: stats.storageSize || 0,
            indexSize: stats.totalIndexSize || 0,
            avgObjSize: stats.avgObjSize || 0,
          };
        } catch {
          return { name: col.name, count: 0, dataSize: 0, storageSize: 0, indexSize: 0, avgObjSize: 0 };
        }
      })
    );

    collections.sort((a, b) => b.storageSize - a.storageSize);

    res.json({
      dbName: dbStats.db,
      collections: dbStats.collections,
      objects: dbStats.objects,
      dataSize: dbStats.dataSize,
      storageSize: dbStats.storageSize,
      indexSize: dbStats.indexSize,
      totalSize: dbStats.totalSize || (dbStats.storageSize + dbStats.indexSize),
      avgObjSize: dbStats.avgObjSize || 0,
      fsTotalSize: dbStats.fsTotalSize || null,
      fsUsedSize: dbStats.fsUsedSize || null,
      collectionDetails: collections,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
