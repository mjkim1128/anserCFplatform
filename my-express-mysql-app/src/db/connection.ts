import mysql from 'mysql2';

export const createConnection = () => {
    const pool = mysql.createPool({
        host: 'answercf.c7euk6wckfdu.ap-northeast-2.rds.amazonaws.com',
        user: 'admin',
        password: 'jun3421792',
        database: 'answercf',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool.promise(); // promise 기반 사용 권장
};
