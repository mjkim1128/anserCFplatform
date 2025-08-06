import express from 'express';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { createConnection } from '../db/connection';

const router = express.Router();
const upload = multer({ dest: 'uploadsAnswer/' }); // 정답용 업로드 폴더
const pool = createConnection();

router.post('/ocr/answer', upload.single('image'), (req, res) => {
  const imagePath = req.file?.path;
  if (!imagePath) return res.status(400).json({ error: 'Image not provided' });

  const pythonScript = path.resolve(__dirname, '../../ocr/answer_ocr.py'); // 정답용 OCR 스크립트

  exec(`python3 ${pythonScript} ${imagePath}`, async (err, stdout, stderr) => {
    fs.unlink(imagePath, () => {});
    if (err) return res.status(500).json({ error: stderr });

    const text = stdout.trim();
    const match = text.match(/(\d+)\s*[-:]?\s*(\d+)/); // 문제번호 + 답 (숫자)

    if (!match) return res.status(400).json({ error: 'Invalid format' });

    const questionNo = parseInt(match[1], 10);
    const answer = parseInt(match[2], 10);

    try {
      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO answers (question_number, answerOCR) VALUES (?, ?)',
        [questionNo, answer]
      );
      conn.release();
      return res.json({ questionNo, answer });
    } catch (dbErr) {
      return res.status(500).json({ error: 'Database error' });
    }
  });
});

export default router;
