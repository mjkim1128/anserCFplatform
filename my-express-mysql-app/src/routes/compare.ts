import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const db = (req as any).db; // req.db에서 DB 풀 받아오기
  if (!db) return res.status(500).json({ error: 'DB connection not found' });

  try {
    const conn = await db.getConnection();

    // 질문용 OCR 결과 조회
    const [questions]: any = await conn.query('SELECT * FROM questionOCR');
    // 정답지 OCR 결과 조회
    const [answers]: any = await conn.query('SELECT * FROM answerOCR');

    // 정답지 데이터를 Map으로 변환 (빠른 조회용)
    const answerMap = new Map<number, number>();
    answers.forEach((row: any) => {
      answerMap.set(row.question_number, row.answer);
    });

    // grading_results 테이블에 비교 결과 저장
    const insertPromises = questions.map((question: any) => {
      const correctAnswer = answerMap.get(question.question_number);
      if (correctAnswer === undefined) return null;

      const isCorrect = question.answer === correctAnswer;
      return conn.query(
        'INSERT INTO grading_results (question_number, user_answer, correct_answer, is_correct) VALUES (?, ?, ?, ?)',
        [question.question_number, question.answer, correctAnswer, isCorrect]
      );
    }).filter(Boolean); // null 제거

    await Promise.all(insertPromises);
    conn.release();

    res.json({ message: 'Grading complete', graded: insertPromises.length });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

export default router;
