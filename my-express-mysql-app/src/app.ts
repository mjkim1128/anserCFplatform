import express from 'express';
import { createConnection } from './db/connection';
import { setRoutes } from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB 연결
const db = createConnection();

// 라우트에 DB 전달
setRoutes(app, db);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
