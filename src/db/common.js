import { createPool } from "slonik";

const uri = "postgres://pyyjason:ppyy213%@localhost:5432/piazza";
export const pool = createPool(uri);
