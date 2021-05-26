import { withIronSession, applyIronSession } from "next-iron-session";

const config = {
  password: "bkUu29xZyUr26kmNFio0EamQT45G11AB",
  cookieName: "pku-piazza-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSession = (handler) => withIronSession(handler, config);

export const applySession = (req, res) => applyIronSession(req, res, config);
