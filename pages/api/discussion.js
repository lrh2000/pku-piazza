import { getDiscussionContentByDID } from "../../src/db/discussion";
import { withSession } from "../../src/session";

async function handleDiscussionContent(req, res) {
  const user = req.session.get("user");
  if (!user) {
    return {
      ok: false,
      msg: "Not logged in",
      homework: [],
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
