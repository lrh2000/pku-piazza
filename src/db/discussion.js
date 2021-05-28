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
        sql`SELECT courseid, discussionid, userid, createdate, theme, name, identity
        FROM discussion JOIN users
        ON discussion.userid = users.id
        WHERE courseid = ${cid}
        ORDER BY discussion.discussionid DESC;`
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
        sql`SELECT courseid, discussionid, userid, createdate, theme, name, identity
        FROM discussion JOIN users
        ON discussion.userid = users.id
        WHERE discussionid = ${did}
        ORDER BY discussion.discussionid DESC;`
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
        sql`SELECT discussionid, postid, userid, createdate, content, name, identity
        FROM discussionContent JOIN users
        ON discussionContent.userid = users.id
        WHERE discussionid = ${did}
        ORDER BY discussionContent.postid ASC;`
    );
    return data;
  });

  const rows = result.rows;
  return rows;
}

export async function insertSubmissionDiscussion(cid, uid, date, theme){
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
          INTO public.discussion (courseid, discussionid, userid, createdate, theme)
          VALUES (${cid}, DEFAULT, ${uid}, ${date}, ${theme});`
        );
        return data;
      });
      return result.rowCount === 1;
}
export async function insertSubmissionContent(did, uid, date, content){
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
            public.discussionContent (discussionid, postid, createdate, userid, content)
          VALUES
            (${did}, DEFAULT, ${date}, ${uid}, ${content});`
        );
        return data;
      });
      return result.rowCount === 1;
}

export async function deleteDiscussionContent(did, pid){
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
          FROM
            public.discussionContent
          WHERE
            postid=${pid} AND discussionid=${did};`
        );
        return data;
      });
      //console.log(result);
      return result.rowCount >= 0;
}
export async function deleteDiscussion(cid, did){
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
          FROM
            public.discussionContent
          WHERE
            discussionid=${did};`
        );
        console.log(data);
        const data1 = await connection.query(
            sql`DELETE
            FROM
              public.discussion
            WHERE
              discussionid=${did} AND courseid=${cid};`
          );
        console.log(data1);
        return data1;
      });
      //console.log(result);
      return result.rowCount >= 0;
}