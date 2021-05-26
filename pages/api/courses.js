import { getCourseList } from "../../src/db/courses";
import { withSession } from "../../src/session";

export default withSession(async (req, res) => {
  const courses = await getCourseList();
  res.status(200).json({
    user: req.session.get("user"),
    courses: courses,
  });
});
