import { Express } from 'express';
import { Pool } from 'mysql2/promise';

// 질문용 OCR 라우터 import
import questionOcrRouter from './questionOcr';
// 정답용 OCR 라우터 import
import answerOcrRouter from './answerOcr';

import compareRouter from './compare';

import resetRouter from './reset';

export const setRoutes = (app: Express, db: Pool) => {
  // 기존 테스트 라우트 (DB 연결 확인용)
  app.get('/test', async (_req, res) => {
    try {
      const [rows] = await db.query('SELECT NOW() AS now');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('DB Error');
    }
  });

  // 질문용 OCR 라우터 등록 + DB 연결 객체 전달
  app.use('/api/ocr/question', (req, _res, next) => {
    (req as any).db = db;  // req 객체에 db 연결 추가
    next();
  }, questionOcrRouter);

  // 정답용 OCR 라우터 등록 + DB 연결 객체 전달
  app.use('/api/ocr/answer', (req, _res, next) => {
    (req as any).db = db;  // req 객체에 db 연결 추가
    next();
  }, answerOcrRouter);
  app.use('/api/compare', (req, _res, next) => {
    (req as any).db = db;
    next();
  }, compareRouter);
  app.use('/api/reset', (req, _res, next) => {
    (req as any).db = db;
    next();
  }, resetRouter);
};
