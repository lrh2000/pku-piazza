import { withSession } from "../../src/session";
import { getUserByName, checkPassword } from "../../src/db/users";

async function handleLogin(req, res) {
  const payload = req.body.payload;

  const user = await getUserByName(payload.username);
  if (!user) {
    return {
      ok: false,
      msg: "Invalid username",
    };
  }

  const ok = await checkPassword(user, payload.password);
  if (!ok) {
    return {
      ok: false,
      msg: "Invalid password",
    };
  }

  req.session.set("user", {
    id: user.id,
    name: user.name,
  });
  await req.session.save();

  return { ok: true };
}

async function handleLogout(req, res) {
  req.session.destroy();
  return { ok: true };
}

function dispatch(req) {
  if (
    req.method !== "POST" ||
    typeof req.body !== "object" ||
    typeof req.body.action !== "string"
  ) {
    return null;
  }

  if (req.body.action === "login") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.username !== "string" ||
      typeof req.body.payload.password !== "string"
    ) {
      return null;
    }
    return handleLogin;
  } else if (req.body.action === "logout") {
    return handleLogout;
  }

  return null;
}

export default withSession(async (req, res) => {
  const handler = dispatch(req);
  if (!handler) {
    res.status(400).json({
      ok: false,
      message: "Invalid argument",
    });
  } else {
    res.status(200).json(await handler(req, res));
  }
});
