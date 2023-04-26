const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
}).promise()

export const getUsers = async () => {
    const [rows] = await pool.query('SELECT * FROM User')
    return rows
}
