import { getCourseList } from '../../src/db/courses';

export default async (req, res) => {
  const courses = await getCourseList();
  res.status(200).json(courses);
}
