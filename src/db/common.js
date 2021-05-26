import { createPool } from "slonik";

const uri = "postgres://postgres@127.0.0.1:5432/postgres";
export const pool = createPool(uri);
