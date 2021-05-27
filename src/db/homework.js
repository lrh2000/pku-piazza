import { pool } from "./common";
import { sql } from "slonik";

export async function getHomeworkList() {
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(sql`SELECT * FROM homework`);
    return data;
  });
  return result.rows;
}

export async function getHomeworkByCID(cid) {
  if (typeof cid !== "number") {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT * FROM homework WHERE courseid = ${cid}`
    );
    return data;
  });

  const rows = result.rows;
  return rows;
}
