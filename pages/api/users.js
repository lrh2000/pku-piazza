import { withSession } from "../../src/session";
import { getUserByName, checkPassword, setUser } from "../../src/db/users";

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
    id: user.userid,
    name: user.name,
    identity: user.identity,
  });
  await req.session.save();

  return { ok: true };
}

async function handleLogout(req, res) {
  req.session.destroy();
  return { ok: true };
}

async function handleSignup(req, res) {
  const payload = req.body.payload;

  const newuser = await setUser(
    payload.username,
    payload.password,
    parseInt(payload.identity)
  );

  if (typeof newuser === "string") {
    return {
      ok: false,
      msg: newuser,
    };
  } else if (!newuser) {
    return {
      ok: false,
    };
  }

  req.session.set("user", {
    id: newuser.userid,
    name: newuser.name,
    identity: newuser.identity,
  });
  await req.session.save();

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
  } else if (req.body.action === "signup") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.username !== "string" ||
      typeof req.body.payload.password !== "string" ||
      !(
        parseInt(req.body.payload.identity) === 1 ||
        parseInt(req.body.payload.identity) === 0
      )
    ) {
      return null;
    }
    return handleSignup;
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
