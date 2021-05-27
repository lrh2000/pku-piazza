import crypto from "crypto";
import { pool } from "./common";
import { sql } from "slonik";

const baseSalt = "TxxDr5w30ikByJFL";

export async function getUserByName(name) {
  if (typeof name !== "string") {
    return null;
  }
  if (!name) {
    return null;
  }

  const result = await pool.connect(async (connection) => {
    const data = connection.query(
      sql`SELECT * FROM users WHERE name = ${name}`
    );
    return data;
  });

  const rows = result.rows;
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

export async function setUser(name, password, identity) {
  if (
    typeof name !== "string" ||
    typeof password !== "string" ||
    typeof identity !== "number"
  ) {
    return null;
  }
  if (!name || !password) {
    return null;
  }
  const salt = crypto.randomBytes(12).toString("base64");
  const calSalt = baseSalt + salt;
  const key = crypto.scryptSync(password, calSalt, 48).toString("base64");
  const result = await pool.connect(async (connection) => {
    const data = connection.query(
      sql`INSERT INTO public.users (id, name, password, identity, salt)
      VALUES (DEFAULT, ${name}, ${key}, ${identity},${salt})
      RETURNING id;`
    );
    return data;
  });
  const rows = result.rows;
  if (rows.length === 0) {
    return null;
  }
  return {
    id: rows[0].id,
    name: name,
    identity: identity,
  };
}

export async function checkPassword(user, password) {
  const salt = baseSalt + user.salt;
  const ok = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 48, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          crypto.timingSafeEqual(key, Buffer.from(user.password, "base64"))
        );
      }
    });
  });
  return ok;
}
