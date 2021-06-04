import {
  getCourseList,
  createCourse,
  destroyCourse,
} from "../../src/db/courses";

import { withSession } from "../../src/session";

async function handleList(req) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      courses: [],
    };
  }

  const list = await getCourseList();
  return {
    ok: true,
    courses: list,
    user: user,
  };
}

async function handleCreate(req) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
    };
  }
  if (user.identity !== 1) {
    return {
      ok: false,
      msg: "No privilege",
    };
  }

  const msg = await createCourse(req.body.name);
  if (typeof msg === "string") {
    return {
      ok: false,
      msg: msg,
    };
  } else if (!msg) {
    return {
      ok: false,
    };
  } else {
    return {
      ok: true,
    };
  }
}

async function handleDestroy(req) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
    };
  }
  if (user.identity !== 1) {
    return {
      ok: false,
      msg: "No privilege",
    };
  }

  const ok = await destroyCourse(req.body.cid);
  return { ok: ok };
}

function dispatch(req) {
  if (req.method === "GET") {
    return handleList;
  } else if (req.method === "POST") {
    if (req.body.action === "create" && typeof req.body.name === "string") {
      return handleCreate;
    } else if (
      req.body.action === "destroy" &&
      typeof req.body.cid === "number"
    ) {
      return handleDestroy;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export default withSession(async (req, res) => {
  const handler = dispatch(req);
  if (!handler) {
    res.status(400).json({ ok: false, msg: "Invalid arguments" });
  } else {
    res.status(200).json(await handler(req));
  }
});
