import { Express } from 'express';
import { Pool } from 'mysql2/promise';

export const setRoutes = (app: Express, db: Pool) => {
  app.get('/test', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT NOW() AS now');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('DB Error');
    }
  });
};
