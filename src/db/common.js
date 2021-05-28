import { createPool } from "slonik";

const uri = "postgres://pyyjason:ppyy213%@127.0.0.1:5432/piazza";
export const pool = createPool(uri);
