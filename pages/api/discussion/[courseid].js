import { getDiscussionByCID } from "../../../src/db/discussion";
import { withSession } from "../../../src/session";

export default withSession(async (req, res) => {
  const user = req.session.get("user");
  if (!user) {
    res.status(400).json({
      ok: false,
      msg: "Not logged in",
      discussion: [],
    });
  } else {
    const { courseid } = req.query;
    const discussion = await getDiscussionByCID(parseInt(courseid));

    res.status(200).json({
      ok: true,
      user: user,
      discussion: discussion,
    });
  }
});
