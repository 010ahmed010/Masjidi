const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const [dbStats, serverStatus, buildInfo] = await Promise.all([
      db.stats({ scale: 1 }),
      db.command({ serverStatus: 1 }).catch(() => null),
      db.command({ buildInfo: 1 }).catch(() => null),
    ]);

    const collectionNames = await db.listCollections().toArray();
    const collections = await Promise.all(
      collectionNames.map(async (col) => {
        const count = await db.collection(col.name).countDocuments().catch(() => 0);
        return { name: col.name, count };
      })
    );
    collections.sort((a, b) => b.count - a.count);

    const FREE_TIER_LIMIT = 512 * 1024 * 1024; // 512 MB in bytes

    res.json({
      dbName: dbStats.db,
      collections: dbStats.collections,
      objects: dbStats.objects,
      dataSize: dbStats.dataSize,
      storageSize: dbStats.storageSize,
      indexSize: dbStats.indexSize,
      totalSize: dbStats.totalSize || (dbStats.storageSize + dbStats.indexSize),
      avgObjSize: dbStats.avgObjSize || 0,
      freeTierLimit: FREE_TIER_LIMIT,
      // Server status
      version: buildInfo?.version || serverStatus?.version || null,
      uptime: serverStatus?.uptime || null,
      host: serverStatus?.host || null,
      connections: serverStatus?.connections || null,
      network: serverStatus?.network || null,
      opcounters: serverStatus?.opcounters || null,
      repl: serverStatus?.repl ? {
        setName: serverStatus.repl.setName,
        ismaster: serverStatus.repl.ismaster,
        me: serverStatus.repl.me,
      } : null,
      collectionDetails: collections,
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

module.exports = router;
