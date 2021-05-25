import { pool } from './common';
import { sql } from 'slonik';

export async function getCourseList() {
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(sql`SELECT * FROM courses`);
    return data;
  });
  return result['rows'];
}

export async function getCourseName(cid) {
  if (typeof cid != 'number') {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT name FROM courses WHERE id = ${cid}`
    );
    return data;
  });

  const rows = result['rows'];
  if (rows.length == 0) {
    return null;
  }

  return rows[0]['name'];
}
