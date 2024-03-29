import { pool } from "./common";
import { sql, UniqueIntegrityConstraintViolationError } from "slonik";

export async function getHomework(cid, hid) {
  if (typeof cid !== "number" || typeof hid !== "number") {
    return null;
  }
  if (isNaN(cid) || isNaN(hid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT *
            FROM Homework
            WHERE courseid = ${cid} AND homeworkid = ${hid}`
    );
    return data;
  });

  const rows = result.rows;
  if (rows.length !== 1) {
    return null;
  }
  return rows[0];
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
      sql`SELECT homeworkid, Homework.content, assign, due, userid
            FROM Homework LEFT OUTER JOIN (
                SELECT *
                  FROM HomeworkSubmission
                  WHERE userid = ${uid}
              ) AS MySubmission
              USING (homeworkid, courseid)
            WHERE courseid = ${cid}
            ORDER BY Homework.homeworkid ASC`
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
            FROM HomeworkSubmission
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
            FROM HomeworkSubmission JOIN Users
            USING (userid)
            WHERE courseid = ${cid}
              AND homeworkid = ${hid}`
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
            INTO
              HomeworkSubmission (courseid, homeworkid, userid, content)
            VALUES
              (${cid}, ${hid}, ${uid}, ${content})`
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
    typeof assign !== "string" ||
    typeof due !== "string" ||
    isNaN(cid) ||
    isNaN(hid)
  ) {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    let data;

    try {
      data = await connection.query(
        sql`INSERT
              INTO
                Homework (courseid, homeworkid, content, assign, due)
              VALUES
                (${cid}, ${hid}, ${content}, ${assign}, ${due})`
      );
    } catch (error) {
      if (error instanceof UniqueIntegrityConstraintViolationError) {
        return "The homework ID already exists. Try another.";
      } else {
        throw error;
      }
    }

    return data.rowCount === 1;
  });

  return result;
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
      sql`UPDATE HomeworkSubmission
            SET content = ${content}
            WHERE courseid = ${cid}
              AND homeworkid = ${hid}
              AND userid = ${uid}`
    );
    return data;
  });

  return result.rowCount === 1;
}
