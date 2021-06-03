import { pool } from "./common";
import { sql } from "slonik";

export async function getDiscussionByCID(cid) {
  if (typeof cid !== "number") {
    return null;
  }
  if (isNaN(cid)) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`SELECT discussionid, userid, createdate, theme, name, identity
            FROM DiscussionWithUser
            WHERE courseid = ${cid}
            ORDER BY discussionid DESC`
    );
    return data;
  });

  return result.rows;
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
      sql`SELECT discussionid, userid, createdate, theme, name, identity
            FROM DiscussionWithUser
            WHERE discussionid = ${did}`
    );
    return data;
  });

  const rows = result.rows;
  if (rows.length !== 1) {
    return null;
  }
  return rows[0];
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
      sql`SELECT discussionid, postid, userid, createdate, content, name, identity
            FROM DiscussionContent JOIN Users
            USING (userid)
            WHERE discussionid = ${did}
            ORDER BY DiscussionContent.postid ASC`
    );
    return data;
  });

  return result.rows;
}

export async function insertSubmissionDiscussion(cid, uid, date, theme) {
  if (
    typeof cid !== "number" ||
    typeof uid !== "number" ||
    typeof date !== "string" ||
    typeof theme !== "string" ||
    isNaN(cid) ||
    isNaN(uid)
  ) {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`INSERT
            INTO
              Discussion (courseid, userid, createdate, theme)
            VALUES
              (${cid}, ${uid}, ${date}, ${theme})`
    );
    return data;
  });
  return result.rowCount === 1;
}

export async function insertSubmissionContent(did, uid, date, content) {
  if (
    typeof did !== "number" ||
    typeof uid !== "number" ||
    typeof date !== "string" ||
    typeof content !== "string" ||
    isNaN(did) ||
    isNaN(uid)
  ) {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`INSERT
            INTO
              DiscussionContent (discussionid, createdate, userid, content)
            VALUES
              (${did}, ${date}, ${uid}, ${content})`
    );
    return data;
  });
  return result.rowCount === 1;
}

export async function deleteDiscussionContent(did, pid) {
  if (
    typeof did !== "number" ||
    typeof pid !== "number" ||
    isNaN(did) ||
    isNaN(pid)
  ) {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`DELETE
            FROM DiscussionContent
            WHERE postid = ${pid} AND discussionid = ${did}`
    );
    return data;
  });
  return result.rowCount > 0;
}

export async function deleteDiscussion(cid, did) {
  if (
    typeof cid !== "number" ||
    typeof did !== "number" ||
    isNaN(cid) ||
    isNaN(did)
  ) {
    return false;
  }

  const result = await pool.connect(async (connection) => {
    const data = await connection.query(
      sql`DELETE
            FROM Discussion
            WHERE discussionid = ${did} AND courseid = ${cid}`
    );
    return data;
  });
  return result.rowCount > 0;
}
