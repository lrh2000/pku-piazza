import {
  getDiscussionContentByDID,
  insertSubmissionContent,
  insertSubmissionDiscussion,
  deleteDiscussionContent,
  deleteDiscussion,
} from "../../src/db/discussion";
import { withSession } from "../../src/session";

async function handleDiscussionContent(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      content: [],
    };
  }

  const payload = req.body.payload;
  const discussionContent = await getDiscussionContentByDID(
    payload.discussionId
  );
  return {
    ok: true,
    user: user,
    content: discussionContent,
  };
}

async function handleSubmitDiscussion(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      content: [],
    };
  }
  const payload = req.body.payload;
  const date = new Date().toISOString().split("T")[0];
  const ok = await insertSubmissionDiscussion(
    payload.courseId,
    user.id,
    date,
    payload.theme
  );
  return {
    ok: ok,
  };
}

async function handleSubmitContent(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      content: [],
    };
  }
  const payload = req.body.payload;
  const date = new Date().toISOString().split("T")[0];
  const ok = await insertSubmissionContent(
    payload.discussionId,
    user.id,
    date,
    payload.content
  );
  return {
    ok: ok,
  };
}

async function handleDeleteContent(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      content: [],
    };
  }
  if (parseInt(user.identity) !== 1) {
    return {
      ok: false,
      msg: "No privilege",
      content: [],
    };
  }
  const payload = req.body.payload;
  const ok = await deleteDiscussionContent(
    payload.discussionId,
    payload.postId
  );
  return {
    ok: ok,
  };
}
async function handleDeleteDiscussion(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      content: [],
    };
  }
  if (parseInt(user.identity) !== 1) {
    return {
      ok: false,
      msg: "No privilege",
      content: [],
    };
  }
  const payload = req.body.payload;
  const ok = await deleteDiscussion(payload.courseId, payload.discussionId);
  return {
    ok: ok,
  };
}

function dispatch(req) {
  if (
    req.method !== "POST" ||
    typeof req.body !== "object" ||
    typeof req.body.action !== "string"
  ) {
    return null;
  }

  if (req.body.action === "content") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.courseId !== "number" ||
      typeof req.body.payload.discussionId !== "number"
    ) {
      return null;
    }
    return handleDiscussionContent;
  } else if (req.body.action === "submitDiscussion") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.courseId !== "number" ||
      typeof req.body.payload.theme !== "string"
    ) {
      return null;
    }
    return handleSubmitDiscussion;
  } else if (req.body.action === "submitContent") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.discussionId !== "number" ||
      typeof req.body.payload.content !== "string"
    ) {
      return null;
    }
    return handleSubmitContent;
  } else if (req.body.action === "deleteContent") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.discussionId !== "number" ||
      typeof req.body.payload.postId !== "number"
    ) {
      return null;
    }
    return handleDeleteContent;
  } else if (req.body.action === "deleteDiscussion") {
    if (
      typeof req.body.payload !== "object" ||
      typeof req.body.payload.discussionId !== "number" ||
      typeof req.body.payload.courseId !== "number"
    ) {
      return null;
    }
    return handleDeleteDiscussion;
  }

  return null;
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
