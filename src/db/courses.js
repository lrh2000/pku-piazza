import { pool } from "./common";
import { sql } from "slonik";

export async function getCourseList() {
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT courseid, name FROM Courses`
    );
    return data;
  });
  return result.rows;
}

export async function getCourseName(cid) {
  if (typeof cid !== "number") {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT name FROM Courses WHERE courseid = ${cid}`
    );
    return data;
  });

  const rows = result.rows;
  if (rows.length === 0) {
    return null;
  }

  return rows[0].name;
}

export async function createCourse(name) {
  if (typeof name !== "string") {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`INSERT
            INTO Courses (courseid, name)
            VALUES (DEFAULT, ${name})`
    );
    return data;
  });

  return result.rowCount === 1;
}

export async function destroyCourse(cid) {
  if (typeof cid !== "number") {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`DELETE FROM Courses WHERE courseid = ${cid}`
    );
    return data;
  });

  return result.rowCount === 1;
}
