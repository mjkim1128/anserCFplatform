import express from 'express';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { createConnection } from '../db/connection'; // 함수 import

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const pool = createConnection(); // pool 객체 생성

router.post('/ocr', upload.single('image'), (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'Image not provided' });
  }

  const pythonScript = path.resolve(__dirname, '../../ocr/latex_ocr.py');

  exec(`python3 ${pythonScript} ${imagePath}`, async (err, stdout, stderr) => {
    fs.unlink(imagePath, () => {});
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    const text = stdout.trim();
    const match = text.match(/(\d+)\s*[-:]?\s*(\d+)/);

    if (!match) {
      return res.status(400).json({ error: 'Invalid format' });
    }

    const questionNo = parseInt(match[1], 10);
    const answer = parseInt(match[2], 10);

    try {
      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO answers (question_number, questionOCR) VALUES (?, ?)',
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