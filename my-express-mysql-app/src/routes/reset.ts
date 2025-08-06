import express from 'express';
const router = express.Router();

router.post('/reset', async (req, res) => {
  const db = (req as any).db;
  if (!db) return res.status(500).json({ error: 'DB connection not found' });

  try {
    const conn = await db.getConnection();

    // 관련 테이블 모두 초기화 (TRUNCATE는 테이블 구조는 유지하면서 데이터만 삭제)
    await conn.query('TRUNCATE TABLE questionOCR');
    await conn.query('TRUNCATE TABLE answerOCR');
    await conn.query('TRUNCATE TABLE grading_results');

    conn.release();
    return res.json({ message: 'All tables reset successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    return res.status(500).json({ error: 'Failed to reset tables' });
  }
});

export default router;
