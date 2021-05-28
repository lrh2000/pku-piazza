import { pool } from "./common";
import { sql } from "slonik";

export async function getHomework(cid, hid) {
    if (typeof cid !== "number"||
    typeof hid !== "number") {
        return null;
    }
    if (isNaN(cid) || isNaN(hid)) {
        return null;
    }
  const result = await pool.connect(async (connection) => {
    const data = await connection.query(sql`SELECT * FROM homework
    WHERE courseid=${cid} AND homeworkid=${hid};`);
    return data;
  });
  return result.rows;
}

export async function getHomeworkList(cid, uid) {
  if (typeof cid !== "number") {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT homeworkid, homework.content, assign, due, userid
        FROM homework LEFT OUTER JOIN submission
          USING (homeworkid, courseid)
        WHERE courseid = ${cid}
          AND (userid = ${uid} OR userid IS NULL)
        ORDER BY homework.homeworkid ASC;`
    );
    return data;
  });

  return result.rows.map((row) => ({
    homeworkid: row.homeworkid,
    content: row.content,
    assign: row.assign,
    due: row.due,
    submitted: typeof row.userid === "number",
  }));
}

export async function getSubmission(cid, hid, uid) {
  if (
    typeof cid !== "number" ||
    typeof hid !== "number" ||
    typeof uid !== "number" ||
    isNaN(cid) ||
    isNaN(hid) ||
    isNaN(uid)
  ) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT content
        FROM submission
        WHERE courseid = ${cid}
          AND homeworkid = ${hid}
          AND userid = ${uid}`
    );
    return data;
  });

  const rows = result.rows;
  if (rows.length === 0) {
    return null;
  }
  return rows[0].content;
}

export async function getSubmissionList(cid, hid) {
    if (
      typeof cid !== "number" ||
      typeof hid !== "number" ||
      isNaN(cid) ||
      isNaN(hid)
    ) {
      return null;
    }
  
    const result = await pool.connect(async (connection) => {
      const data = await connection.query(
        sql`SELECT courseid, homeworkid, userid, content, name, identity
          FROM submission JOIN users
          ON submission.userid = users.id
          WHERE courseid = ${cid}
            AND homeworkid = ${hid};`
      );
      return data;
    });
  
    const rows = result.rows;
    return rows;
  }

export async function insertSubmission(cid, hid, uid, content) {
  if (
    typeof cid !== "number" ||
    typeof hid !== "number" ||
    typeof uid !== "number" ||
    typeof content !== "string" ||
    isNaN(cid) ||
    isNaN(hid) ||
    isNaN(uid)
  ) {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`INSERT
        INTO submission (courseid, homeworkid, userid, content)
        VALUES (${cid}, ${hid}, ${uid}, ${content})`
    );
    return data;
  });

  return result.rowCount === 1;
}

export async function insertNewHomework(cid, hid, content, assign, due) {
    if (
      typeof cid !== "number" ||
      typeof hid !== "number" ||
      typeof content !== "string" ||
      isNaN(cid) ||
      isNaN(hid)
    ) {
      return false;
    }
  
    const result = await pool.connect(async (connection) => {
      const data = await connection.query(
        sql`INSERT
          INTO homework (courseid, homeworkid, content, assign, due)
          VALUES (${cid}, ${hid}, ${content}, ${assign}, ${due});`
      );
      return data;
    });
  
    return result.rowCount === 1;
  }

export async function updateSubmission(cid, hid, uid, content) {
  if (
    typeof cid !== "number" ||
    typeof hid !== "number" ||
    typeof uid !== "number" ||
    typeof content !== "string" ||
    isNaN(cid) ||
    isNaN(cid) ||
    isNaN(hid) ||
    isNaN(uid)
  ) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`UPDATE submission
        SET content = ${content}
        WHERE courseid = ${cid}
          AND homeworkid = ${hid}
          AND userid = ${uid}`
    );
    return data;
  });

  return result.rowCount === 1;
}
