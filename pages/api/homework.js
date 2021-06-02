import { withSession } from "../../src/session";
import {
  getHomeworkList,
  getSubmission,
  getSubmissionList,
  getHomework,
  updateSubmission,
  insertSubmission,
  insertNewHomework,
} from "../../src/db/homework";

async function handleList(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      homework: [],
    };
  }

  const cid = Number.parseInt(req.query.cid);
  const homework = await getHomeworkList(cid, user.id);
  return {
    ok: true,
    user: user,
    homework: homework,
  };
}

async function handleSubmissionList(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      homework: [],
    };
  }

  const cid = Number.parseInt(req.query.cid);
  const hid = Number.parseInt(req.query.hid);

  const submissions = await getSubmissionList(cid, hid);
  return {
    ok: true,
    user: user,
    submissions: submissions,
  };
}

async function handleSubmit(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
    };
  }

  const cid = Number.parseInt(req.query.cid);
  const hid = Number.parseInt(req.query.hid);

  const content = await getSubmission(cid, hid, user.id);
  let ok;
  if (typeof content === "string") {
    ok = await updateSubmission(cid, hid, user.id, req.body);
  } else {
    ok = await insertSubmission(cid, hid, user.id, req.body);
  }
  return {
    ok: ok,
  };
}

async function handleReview(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      content: "",
    };
  }

  const cid = Number.parseInt(req.query.cid);
  const hid = Number.parseInt(req.query.hid);

  const content = await getSubmission(cid, hid, user.id);
  if (typeof content !== "string") {
    return {
      ok: false,
      msg: "Not found",
      content: "",
    };
  }
  return {
    ok: true,
    content: content,
  };
}

async function handleCreateHomework(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
    };
  }
  if (parseInt(user.identity) !== 1) {
    return {
      ok: false,
      msg: "No privilege",
    };
  }

  const payload = req.body;
  const homework = await getHomework(payload.courseId, payload.homeworkId);
  if (homework.length > 0) {
    return {
      ok: false,
      msg: "Homework ID already used",
    };
  }
  const ok = await insertNewHomework(
    payload.courseId,
    payload.homeworkId,
    payload.content,
    payload.assign,
    payload.due
  );
  return {
    ok: ok,
  };
}

function dispatch(req) {
  if (req.query.action === "list") {
    if (req.method !== "GET" || typeof req.query.cid !== "string") {
      return null;
    }
    return handleList;
  } else if (req.query.action === "submissionList") {
    if (
      req.method !== "GET" ||
      typeof req.query.cid !== "string" ||
      typeof req.query.hid !== "string"
    ) {
      return null;
    }
    return handleSubmissionList;
  } else if (req.query.action === "submit") {
    if (
      req.method !== "POST" ||
      typeof req.query.cid !== "string" ||
      typeof req.query.hid !== "string" ||
      typeof req.body !== "string"
    ) {
      return null;
    }
    return handleSubmit;
  } else if (req.query.action === "review") {
    if (
      req.method !== "GET" ||
      typeof req.query.cid !== "string" ||
      typeof req.query.hid !== "string"
    ) {
      return null;
    }
    return handleReview;
  } else if (req.query.action === "inspect") {
    return null;
  } else if (req.query.action === "score") {
    return null;
  } else if (req.query.action === "createHomework") {
    if (
      req.method !== "POST" ||
      typeof req.body.courseId !== "number" ||
      typeof req.body.homeworkId !== "number" ||
      typeof req.body.content !== "string"
    ) {
      return null;
    }
    return handleCreateHomework;
  } else {
    return null;
  }
}

export default withSession(async (req, res) => {
  const handler = dispatch(req);
  if (!handler) {
    res.status(400).json({ ok: false, msg: "Invalid arguments" });
  } else {
    const result = await handler(req, res);
    res.status(200).json(result);
  }
});
