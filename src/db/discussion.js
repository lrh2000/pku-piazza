import { pool } from "./common";
import { sql } from "slonik";

export async function getDiscussionList() {
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(sql`SELECT * FROM discussion`);
    return data;
  });
  return result.rows;
}

export async function getDiscussionByCID(cid) {
  if (typeof cid !== "number") {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT * FROM discussion WHERE courseid = ${cid}`
    );
    return data;
  });

  const rows = result.rows;
  return rows;
}

export async function getDiscussionByDID(did) {
  if (typeof did !== "number") {
    return null;
  }
  if (isNaN(did)) {
    return null;
  }
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT * FROM discussion WHERE discussionid = ${did}`
    );
    return data;
  });

  const rows = result.rows;
  return rows;
}

export async function getDiscussionContentByDID(did) {
  if (typeof did !== "number") {
    return null;
  }
  if (isNaN(did)) {
    return null;
  }
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT * FROM discussionContent WHERE discussionid = ${did}`
    );
    return data;
  });

  const rows = result.rows;
  return rows;
}
