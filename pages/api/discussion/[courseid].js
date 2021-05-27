import { getDiscussionByCID } from "../../../src/db/discussion";

export default async (req, res) => {
  const { courseid } = req.query;
  const discussionByCID = await getDiscussionByCID(parseInt(courseid));
  res.status(200).json(discussionByCID);
};
