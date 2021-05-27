import { getDiscussionContentByDID } from "../../src/db/discussion";

async function handleDiscussioncontent(req, res) {
  const payload = req.body.payload;
  const discussionContent = await getDiscussionContentByDID(
    payload.discussionId
  );
  return discussionContent;
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
    return handleDiscussioncontent;
  }

  return null;
}

export default async (req, res) => {
  const handler = dispatch(req);
  if (!handler) {
    res.status(400).json({
      ok: false,
      message: "Invalid argument",
    });
  } else {
    const ret = await handler(req, res);
    res.status(200).json(ret);
  }
};